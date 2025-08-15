import type {GeocodingResponse, WeatherData} from "@/api/types.ts";
import {Card, CardContent,} from "@/components/ui/card"
import {ArrowDown, ArrowUp, Droplets, Wind} from "lucide-react";
import {motion} from 'motion/react';
import type {RefObject} from "react";

interface currentWeatherProps {
	data: WeatherData;
	location?: GeocodingResponse;
	ref: RefObject<HTMLDivElement>;
}

function CurrentWeather({data, location,ref}: currentWeatherProps) {

	const {
		weather: [currentWeather],
		main: {temp, feels_like, humidity, temp_min, temp_max},
		wind: {speed},
	} = data;

	const MotionCard = motion(Card);

	return (
		<MotionCard
			className={'overflow-hidden'}
			whileHover={{
				scale: 1.01,
			}}
			ref={ref}
		>
			<CardContent className={'p-6'}>
				<div className={'grid gap-6 md:grid-cols-2'}>
					<div className={'space-y-4'}>
						<div className={'space-y-2'}>
							<div className={'flex items-end gap-1'}>
								<h2 className={'text-2xl font-bold tracking-tighter'}>{location?.name}</h2>
								{location?.state && (
									<span className={'text-muted-foreground'}>
										, {location.state}
									</span>
								)}
							</div>
							<p className={'text-sm text-muted-foreground'}>
								{location?.country}
							</p>
						</div>
						<div className={'flex items-center gap-2'}>
							<p className={'text-7xl font-bold tracking-tighter '}>
								{temp.toFixed(1)}&deg;
							</p>
							<div className={'space-y-1'}>
								<p className={'text-sm font-medium text-muted-foreground ml-3'}>
									Feels like {feels_like.toFixed(1)}&deg;
								</p>
								<div className={'flex gap-2 text=sm font-medium'}>
									<span className={'flex items-center gap-1 text-blue-500'}>
										<ArrowDown className={'size-3'}/>
										{temp_min.toFixed(1)}&deg;
									</span>
									<span className={'flex items-center gap-1 text-red-500'}>
										<ArrowUp className={'size-3'}/>
										{temp_max.toFixed(1)}&deg;
									</span>
								</div>
							</div>
						</div>

						<div className={'grid grid-cols-2 gap-4'}>
							<div className={'flex items-center gap-2'}>
								<Droplets className={'size-4 text-blue-500'}/>
								<div className={'space-y-0.5'}>
									<p className={'text-sm font-medium'}>Humidity</p>
									<p className={'text-sm font-medium text-muted-foreground'}>{humidity}</p>
								</div>
							</div>
							<div className={'flex items-center gap-2'}>
								<Wind className={'size-4 text-blue-500'}/>
								<div className={'space-y-0.5'}>
									<p className={'text-sm font-medium'}>Wind Speed</p>
									<p className={'text-sm font-medium text-muted-foreground'}>{speed} m/s</p>
								</div>
							</div>
						</div>
					</div>

					<div className={'flex flex-col items-center justify-center'}>
						<div className={'relative flex aspect-square w-full max-w-[200px] items-center justify-center'}>
							<img
								src={`https://openweathermap.org/img/wn/${currentWeather.icon}@4x.png`}
								alt={currentWeather.description}
								className={'size-full object-contain'}
							/>
							<div className={'absolute bottom-0 text-center'}>
								<p className={'text-sm font-medium capitalize'}>
									{currentWeather.description}
								</p>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</MotionCard>
	);
}

export default CurrentWeather;