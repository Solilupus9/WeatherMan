import type {ForecastData} from "@/api/types.ts";
import {format} from "date-fns";
import {Card, CardContent, CardHeader, CardTitle,} from "@/components/ui/card"
import {ArrowDown, ArrowUp, Droplets, Wind} from "lucide-react";
import { motion } from "motion/react";
import type {RefObject} from "react";

interface WeatherForecastTypes {
	data: ForecastData;
	ref:RefObject<HTMLDivElement>;
}

interface WeatherForecast {
	temp_min: number;
	temp_max: number;
	weather: {
		id: number;
		main: string;
		description: string;
		icon: string;
	};
	humidity: number;
	wind: number;
	date: number;
}

function WeatherForecast({data,ref}: WeatherForecastTypes) {

	const dailyForecasts = data.list.reduce((acc, forecast) => {
		const date = format(new Date(forecast.dt * 1000), 'yyyy-MM-dd');
		if (!acc[date]) {
			acc[date] = {
				temp_min : forecast.main.temp_min,
				temp_max : forecast.main.temp_max,
				weather: forecast.weather[0],
				humidity: forecast.main.humidity,
				wind: forecast.wind.speed,
				date: forecast.dt,
			};
		} else {
			acc[date].temp_min = Math.min(acc[date].temp_min, forecast.main.temp_min);
			acc[date].temp_max = Math.max(acc[date].temp_max, forecast.main.temp_max);
		}
		return acc;
	}, {} as Record<string, WeatherForecast>);

	const nextDays = Object.values(dailyForecasts).slice(0, 6);

	return (
		<Card ref={ref} className={'h-full'}>
			<CardHeader>
				<CardTitle>Five-day Forecast</CardTitle>
			</CardHeader>
			<CardContent className={'h-full'}>
				<div className={'grid gap-4 h-full'}>
					{nextDays.map((day) => (
						<motion.div
							whileHover={{
								scale: 1.03,
							}}
							key={day.date}
							className={'grid grid-cols-3 items-center gap-4 rounded-lg border p-4 cursor-default'}
						>
							<div>
								<p className={'font-medium'}>{format(new Date(day.date*1000),'EEE, MMM d')}</p>
								<p className={'text-sm text-muted-foreground capitalize'}>{day.weather.description}</p>
							</div>
							<div className={'flex justify-center gap-4'}>
								<span className={'flex items-center text-blue-500'}>
									<ArrowDown className={'mr-1 size-4'}/>
									{day.temp_min}&deg;
								</span>
								<span className={'flex items-center text-red-500'}>
									<ArrowUp className={'mr-1 size-4'}/>
									{day.temp_max}&deg;
								</span>
							</div>
							<div className={'flex justify-center gap-4'}>
								<span className={'flex items-center gap-1'}>
									<Droplets className={'size-4 text-blue-500'}/>
									<span className={'text-sm'}>{day.humidity}%</span>
								</span>
								<span className={'flex items-center gap-1'}>
									<Wind className={'text-blue-500 size-4'}/>
									<span className={'text-sm'}>{day.wind} m/s</span>
								</span>
							</div>
						</motion.div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

export default WeatherForecast;