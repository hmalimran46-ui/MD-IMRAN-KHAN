/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { ChartDataPoint } from "../types";

interface MetricChartProps {
  data: ChartDataPoint[];
  color?: string;
  themeColor?: string;
}

export default function MetricChart({ data, color = "#06b6d4" }: MetricChartProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 260 });
  const [activePoint, setActivePoint] = useState<ChartDataPoint | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // ResizeObserver implementation according to responsiveness guidelines
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width } = entries[0].contentRect;
      setDimensions({
        width: Math.max(width, 280),
        height: 260
      });
    });
    
    resizeObserver.observe(containerRef.current);
    
    // Set initial size
    const rect = containerRef.current.getBoundingClientRect();
    setDimensions({
      width: Math.max(rect.width, 280),
      height: 260
    });

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Fresh paint

    const margin = { top: 25, right: 25, bottom: 40, left: 55 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scalePoint()
      .domain(data.map(d => d.label))
      .range([0, width]);

    const values = data.map(d => d.value);
    const maxValue = d3.max(values) || 10000;
    const minValue = d3.min(values) || 0;
    
    const yScale = d3.scaleLinear()
      .domain([0, maxValue * 1.15]) // 15% headroom for aesthetic spacing
      .range([height, 0]);

    // Gridlines (y-axis)
    g.append("g")
      .attr("class", "grid")
      .attr("opacity", 0.05)
      .call(d3.axisLeft(yScale)
        .ticks(5)
        .tickSize(-width)
        .tickFormat(() => "")
      )
      .call(g => g.select(".domain").remove());

    // Defs for premium gradients
    const defs = svg.append("defs");
    
    const gradId = `glow-grad-${color.replace("#", "")}`;
    const fillGradId = `fill-grad-${color.replace("#", "")}`;

    // Premium dual-tone styling
    const strokeGrad = defs.append("linearGradient")
      .attr("id", gradId)
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "100%").attr("y2", "0%");
    strokeGrad.append("stop").attr("offset", "0%").attr("stop-color", "#06b6d4");
    strokeGrad.append("stop").attr("offset", "50%").attr("stop-color", "#3b82f6");
    strokeGrad.append("stop").attr("offset", "100%").attr("stop-color", "#a855f7");

    // Fading background fill gradient
    const fillGrad = defs.append("linearGradient")
      .attr("id", fillGradId)
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "0%").attr("y2", "100%");
    fillGrad.append("stop").attr("offset", "0%").attr("stop-color", color).attr("stop-opacity", 0.3);
    fillGrad.append("stop").attr("offset", "100%").attr("stop-color", color).attr("stop-opacity", 0.0);

    // X-Axis
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .attr("color", "rgba(156, 163, 175, 0.15)")
      .call(d3.axisBottom(xScale).tickSize(6))
      .call(g => g.select(".domain").remove())
      .selectAll("text")
      .attr("class", "font-mono text-[10px]")
      .attr("fill", "#9ca3af")
      .attr("dy", "12px");

    // Y-Axis
    g.append("g")
      .attr("color", "rgba(156, 163, 175, 0.15)")
      .call(d3.axisLeft(yScale)
        .ticks(5)
        .tickFormat(v => {
          const val = Number(v);
          if (val >= 1000000) return (val / 1000000).toFixed(1) + "M";
          if (val >= 1000) return (val / 1000).toFixed(0) + "k";
          return val.toString();
        })
      )
      .call(g => g.select(".domain").remove())
      .selectAll("text")
      .attr("class", "font-mono text-[10px]")
      .attr("fill", "#9ca3af")
      .attr("dx", "-4px");

    // Generative Line & Area functions
    const lineGen = d3.line<ChartDataPoint>()
      .x(d => xScale(d.label) || 0)
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    const areaGen = d3.area<ChartDataPoint>()
      .x(d => xScale(d.label) || 0)
      .y0(height)
      .y1(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Draw fading filled curve
    g.append("path")
      .datum(data)
      .attr("fill", `url(#${fillGradId})`)
      .attr("d", areaGen);

    // Draw glowing stroke line
    const path = g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", `url(#${gradId})`)
      .attr("stroke-width", 3.5)
      .attr("d", lineGen);

    // Dash-array reveal animation
    const totalLength = path.node()?.getTotalLength() || 0;
    path
      .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1200)
      .ease(d3.easeCubicOut)
      .attr("stroke-dashoffset", 0);

    // Intersection track line (for interactive tooltips)
    const hoverLine = g.append("line")
      .attr("stroke", "rgba(255, 255, 255, 0.15)")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "4,4")
      .attr("y1", 0)
      .attr("y2", height)
      .style("display", "none");

    // Dot markers
    const dots = g.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot cursor-pointer")
      .attr("cx", d => xScale(d.label) || 0)
      .attr("cy", d => yScale(d.value))
      .attr("r", 5)
      .attr("fill", "#040212")
      .attr("stroke", color)
      .attr("stroke-width", 2.5)
      .style("opacity", 0);

    // Delayed entry for plots
    dots.transition()
      .delay(600)
      .duration(400)
      .style("opacity", 1);

    // Overlay element to capture mouse coordinates
    const overlay = g.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "transparent")
      .style("pointer-events", "all");

    // Helper to find closest point on mouse move
    const steps = data.map(d => xScale(d.label) || 0);

    overlay
      .on("mousemove", function(event) {
        const [mx] = d3.pointer(event);
        
        // Find closest coordinate step index
        let closestIndex = 0;
        let minDiff = Infinity;
        steps.forEach((sx, idx) => {
          const diff = Math.abs(sx - mx);
          if (diff < minDiff) {
            minDiff = diff;
            closestIndex = idx;
          }
        });

        const targetData = data[closestIndex];
        const targetX = steps[closestIndex];
        const targetY = yScale(targetData.value);

        hoverLine
          .style("display", "block")
          .attr("x1", targetX)
          .attr("x2", targetX);

        dots.attr("r", (d, idx) => idx === closestIndex ? 7.5 : 5)
          .attr("fill", (d, idx) => idx === closestIndex ? color : "#040212")
          .attr("stroke", (d, idx) => idx === closestIndex ? "#ffffff" : color);

        setActivePoint(targetData);
      })
      .on("mouseleave", function() {
        hoverLine.style("display", "none");
        dots.attr("r", 5)
          .attr("fill", "#040212")
          .attr("stroke", color);
        setActivePoint(null);
      });

  }, [data, dimensions, color]);

  return (
    <div className="w-full relative py-2" ref={containerRef}>
      {/* Live HUD Read-out on interactive hover */}
      <div className="absolute top-2 right-4 text-right transition-opacity duration-300 pointer-events-none">
        {activePoint ? (
          <div>
            <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">{activePoint.label}</span>
            <div className="text-xl md:text-2xl font-mono text-glow-cyan text-cyan-400 font-bold">
              {activePoint.value.toLocaleString()}
            </div>
          </div>
        ) : (
          <div>
            <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">Growth Curve</span>
            <div className="text-xl md:text-2xl font-mono text-glow-purple text-purple-400 font-bold">
              Inbound Campaign
            </div>
          </div>
        )}
      </div>

      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="overflow-visible block w-full select-none"
      />
    </div>
  );
}
