import {useParams, useSearchParams} from "react-router";
import {useForecastQuery, usePollutionQuery, useWeatherQuery} from "@/hooks/useWeather.ts";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertTriangle} from "lucide-react";
import LoadingSkeleton from "@/components/loading-skeleton.tsx";
import FavouriteButton from "@/components/favouriteButton.tsx";
import {MotionCurrentWeather,MotionHourlyTemperature, MotionPollutionDetails,MotionSunDetails,MotionWeatherDetails, MotionWeatherForecast} from "@/components/motionComponents.tsx";

function CityPage() {

	const [searchParams] = useSearchParams();
	const params = useParams();
	const lat = parseFloat(searchParams.get('lat') || '0');
	const lon = parseFloat(searchParams.get('lon') || '0');

	const coordinates = {lat, lon};

	const weatherQuery = useWeatherQuery(coordinates);
	const forecastQuery = useForecastQuery(coordinates);
	const pollutionQuery=usePollutionQuery(coordinates);

	if (weatherQuery.error || forecastQuery.error) {
		return (
			<Alert variant={'destructive'}>
				<AlertTriangle className={'size-4'}/>
				<AlertTitle>Error</AlertTitle>
				<AlertDescription className={'flex flex-col gap-4'}>
					Failed to fetch weather data for {params.cityName || 'the specified city'}. Please check the city
					name or coordinates.
				</AlertDescription>
			</Alert>
		);
	}

	if (!weatherQuery.data || !forecastQuery.data || !params.cityName || !pollutionQuery.data) {
		return <LoadingSkeleton/>;
	}

	const fadeIn = (delay: number) => ({
		initial: {opacity: 0, y: 20},
		animate: {opacity: 1, y: 0, transition: {delay, duration: 0.5}},
	});

	return (
		<div className={'space-y-4'}>
			<div className={'flex items-center justify-between'}>
				<h1 className={'text-3xl font-bold tracking-tight'}>{params.cityName}, {weatherQuery.data.sys.country}</h1>
				<div>
					<FavouriteButton data={{...weatherQuery.data, name: params.cityName}}/>
				</div>
			</div>

			<div className={'grid gap-6'}>
				<div className={'flex flex-col   gap-4'}>
					<MotionCurrentWeather {...fadeIn(0.2)} data={weatherQuery.data}/>
					<MotionHourlyTemperature {...fadeIn(0.4)} data={forecastQuery.data} isCityTemps={true}/>
				</div>
				<div className={'grid gap-6 md:grid-cols-2 items-start'}>
					<div className={'flex flex-col gap-6'}>
						<MotionSunDetails whileHover={{scale:1.01}} {...fadeIn(0.6)} sunriseTime={weatherQuery.data.sys.sunrise} sunsetTime={weatherQuery.data.sys.sunset}/>
						<MotionWeatherDetails whileHover={{scale:1.01}} {...fadeIn(0.7)} data={weatherQuery.data}/>
					</div>
					<MotionWeatherForecast whileHover={{scale:1.01}} {...fadeIn(0.8)} data={forecastQuery.data}/>
				</div>
				<MotionPollutionDetails whileHover={{scale: 1.01}} {...fadeIn(1)} data={pollutionQuery.data}/>
			</div>
		</div>
	);
}

export default CityPage;