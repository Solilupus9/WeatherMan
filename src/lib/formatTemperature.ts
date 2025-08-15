export default function formatTemperature(temp: number): string {
	return `${(temp - 273.15).toFixed(1)} °`;
}