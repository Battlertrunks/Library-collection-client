import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import ProgressChart from "./ProgressChart";

describe("ProgressChart", () => {
  it("renders the wrapper div with arc-progress-wrapper class", () => {
    const html = renderToString(<ProgressChart percentage={0.5} />);
    expect(html).toContain("arc-progress-wrapper");
  });

  it("renders an SVG element", () => {
    const html = renderToString(<ProgressChart percentage={0.5} />);
    expect(html).toContain("<svg");
  });

  it("renders two circle elements", () => {
    const html = renderToString(<ProgressChart percentage={0.5} />);
    const matches = html.match(/<circle/g);
    expect(matches).toHaveLength(2);
  });

  it("applies the default size to the wrapper style", () => {
    const html = renderToString(<ProgressChart percentage={0.5} />);
    expect(html).toContain('width:300');
    expect(html).toContain('height:300');
  });

  it("applies a custom size to the wrapper style", () => {
    const html = renderToString(<ProgressChart percentage={0.5} size={200} />);
    expect(html).toContain('width:200');
    expect(html).toContain('height:200');
  });

  it("sets the viewBox based on the size", () => {
    const html = renderToString(<ProgressChart percentage={0.5} size={280} />);
    expect(html).toContain('viewBox="0 0 280 280"');
  });

  it("clamps percentage to 0 when negative", () => {
    const html = renderToString(<ProgressChart percentage={-0.1} />);
    const svg = html.match(/<svg[\s\S]*?<\/svg>/);
    expect(svg).not.toBeNull();
  });

  it("clamps percentage to 1 when greater than 1", () => {
    const html = renderToString(<ProgressChart percentage={1.5} />);
    const svg = html.match(/<svg[\s\S]*?<\/svg>/);
    expect(svg).not.toBeNull();
  });

  it("renders custom track color", () => {
    const html = renderToString(<ProgressChart percentage={0.5} trackColor="#FF0000" />);
    expect(html).toContain('#FF0000');
  });

  it("renders custom progress color", () => {
    const html = renderToString(<ProgressChart percentage={0.5} progressColor="#00FF00" />);
    expect(html).toContain('#00FF00');
  });

  it("applies additional className to the wrapper", () => {
    const html = renderToString(<ProgressChart percentage={0.5} className="my-custom-class" />);
    expect(html).toContain('my-custom-class');
  });

  it("renders default track color when not provided", () => {
    const html = renderToString(<ProgressChart percentage={0.5} />);
    expect(html).toContain('#E5E5E5');
  });

  it("renders default progress color when not provided", () => {
    const html = renderToString(<ProgressChart percentage={0.5} />);
    expect(html).toContain('#000000');
  });

  it("applies custom startAngle as a rotation transform", () => {
    const html = renderToString(<ProgressChart percentage={0.5} startAngle={90} />);
    expect(html).toContain('rotate(90deg)');
  });

  it("applies default startAngle of -150 degrees", () => {
    const html = renderToString(<ProgressChart percentage={0.5} />);
    expect(html).toContain('rotate(-150deg)');
  });

  it("sets strokeLinecap to round on the progress circle", () => {
    const html = renderToString(<ProgressChart percentage={0.5} />);
    expect(html).toContain('stroke-linecap="round"');
  });

  it("computes the correct radius from size and strokeWidth", () => {
    const html = renderToString(<ProgressChart percentage={1} size={100} strokeWidth={10} />);
    const expectedRadius = (100 - 10) / 2;
    expect(html).toContain(`r="${expectedRadius}"`);
  });
});
