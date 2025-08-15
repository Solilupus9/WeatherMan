import type {WeatherData} from "@/api/types.ts";
import {Cloud, CloudRainWind, Compass, Droplets, Eye, Gauge, Mountain, Waves} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle,} from "@/components/ui/card"
import {motion} from "motion/react";
import type {RefObject} from "react";

interface WeatherDetailsTypes {
	data: WeatherData;
	ref: RefObject<HTMLDivElement>;
}

function WeatherDetails({data, ref}: WeatherDetailsTypes) {

	const {wind, main, clouds, rain} = data;

	function getWindDirection(deg: number) {
		const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
		const index = Math.round(((deg % 360) < 0 ? deg + 360 : deg) / 45) % 8;
		return directions[index];
	}

	function calculateDewPoint(tempC: number, humidity: number): number {
		const a = 17.27;
		const b = 237.7;
		const alpha = ((a * tempC) / (b + tempC)) + Math.log(humidity / 100);
		return (b * alpha) / (a - alpha);
	}
	const dewPoint =calculateDewPoint(main.temp, main.humidity);

	const details = [
		{
			title: 'Wind Direction',
			value: `${getWindDirection(wind.deg)} (${wind.deg}°)`,
			icon: Compass,
			color: 'text-green-500'
		},
		{
			title: 'Pressure',
			value: `${main.pressure} hPa`,
			icon: Gauge,
			color: 'text-purple-500'
		},
		{
			title: 'Sea Level Pressure',
			value: main.sea_level !== undefined ? `${main.sea_level} hPa` : 'N/A',
			icon: Waves,
			color: 'text-blue-400'
		},
		{
			title: 'Ground Level Pressure',
			value: main.grnd_level !== undefined ? `${main.grnd_level} hPa` : 'N/A',
			icon: Mountain,
			color: 'text-yellow-700'
		},
		{
			title: 'Rain Volume',
			value: rain ? `${rain['1h'] || 0} mm` : 'No Rain',
			icon: CloudRainWind,
			color: 'text-blue-500'
		},
		{
			title: 'Clouds',
			value: `${clouds.all}%`,
			icon: Cloud,
			color: 'text-gray-300'
		},
		{
			title: 'Visibility',
			value: data.visibility !== undefined ? `${(data.visibility / 1000).toFixed(1)} km` : 'N/A',
			icon: Eye,
			color: 'text-cyan-500'
		},
		{
			title: 'Dew Point',
			value: dewPoint !== undefined ? `${dewPoint.toFixed(1)}°` : 'N/A',
			icon: Droplets,
			color: 'text-blue-300'
		}
	];

	return (
		<Card ref={ref}>
			<CardHeader>
				<CardTitle>Weather Details</CardTitle>
			</CardHeader>
			<CardContent>
				<div
					className={'grid gap-6 md:grid-cols-2'}
				>
					{details.map((detail) => (
						<motion.div
							whileHover={{
								scale: 1.03,
							}}
							key={detail.title}
							className={'flex items-center gap-3 rounded-lg p-4 border cursor-default'}
						>
							<detail.icon className={`size-5 ${detail.color}`}/>
							<div>
								<p className={'text-sm font-medium leading-none'}>{detail.title}</p>
								<p className={'text-sm text-muted-foreground'}>{detail.value}</p>
							</div>
						</motion.div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

export default WeatherDetails;