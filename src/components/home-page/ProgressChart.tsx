type progressChart = {
  percentage: number; // Value between 0 and 1
  size?: number; // Diameter of the chart in pixels
  strokeWidth?: number; // Thickness of the progress line
  startAngle?: number; // Starting angle in degrees (default -150 for a nice arc)
  trackColor?: string; // Color of the background track
  progressColor?: string; // Color of the progress line
  className?: string; // Additional CSS classes for styling
}

const ProgressChart = (props: progressChart) => {
  const {
    percentage,
    size = 300,
    strokeWidth = 8,
    startAngle = -150,
    trackColor = "#E5E5E5",
    progressColor = "#000000",
    className = ""
  } = props;
  // Radius must account for the stroke width so the line stays inside the viewBox
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Clamp percentage between 0 and 1
  const progress = Math.min(Math.max(percentage, 0), 1);

  // How much of the circle to "hide" to show the progress
  const dashoffset = circumference * (1 - progress);

  return (
    <div className={`arc-progress-wrapper ${className}`} style={{ width: size, height: size, position: 'relative' }}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        style={{
          width: '100%',
          height: '100%',
          transform: `rotate(${startAngle}deg)`,
          transformOrigin: 'center',
          overflow: 'visible'
        }}
      >
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress Line */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          strokeLinecap="round" // Crucial for the smooth pill-shaped ends
          style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
    </div>
  );
};

export default ProgressChart;
