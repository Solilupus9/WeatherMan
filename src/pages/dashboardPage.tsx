import {Button} from "@/components/ui/button.tsx";
import {AlertTriangle, MapPin, RefreshCw} from "lucide-react";
import {useGeolocation} from "@/hooks/useGeolocation.ts";
import LoadingSkeleton from "@/components/loading-skeleton.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {useForecastQuery, useReverseGeocodeQuery, useWeatherQuery} from "@/hooks/useWeather.ts";
import CurrentWeather from "@/components/currentWeather.tsx";
import HourlyTemperature from "@/components/hourlyTemperature.tsx";
import WeatherDetails from "@/components/weatherDetails";
import WeatherForecast from "@/components/weatherForecast";
import FavouriteCities from "@/components/favouriteCities.tsx";
import RefreshLocationButton from "@/components/refreshLocationButton.tsx";
import {motion} from "motion/react";
import SunDetails from "@/components/sunDetails.tsx";

function DashboardPage() {

	const {coordinates, error, getLocation, isLoading} = useGeolocation();

	const locationQuery = useReverseGeocodeQuery(coordinates);
	const weatherQuery = useWeatherQuery(coordinates);
	const forecastQuery = useForecastQuery(coordinates);

	function handleRefresh() {
		getLocation();
		if (coordinates) {
			weatherQuery.refetch();
			forecastQuery.refetch();
			locationQuery.refetch();
		}
	}

	if (isLoading) {
		return <LoadingSkeleton/>
	}

	if (error) {
		return (<Alert variant={'destructive'}>
			<AlertTriangle className={'size-4'}/>
			<AlertTitle>Location Error</AlertTitle>
			<AlertDescription className={'flex flex-col gap-4'}>
				<p>{error}</p>
				<Button onClick={getLocation} variant={'outline'} className={'w-fit'}>
					<MapPin className={'mr-2 size-4'}/>
					Enable Location
				</Button>
			</AlertDescription>
		</Alert>);
	}

	if (!coordinates) {
		return (<Alert variant={'destructive'}>
			<AlertTitle>Location Required</AlertTitle>
			<AlertDescription className={'flex flex-col gap-4'}>
				<p>Please enable location access to see your local weather</p>
				<Button onClick={getLocation} variant={'outline'} className={'w-fit'}>
					<MapPin className={'mr-2 size-4'}/>
					Enable Location
				</Button>
			</AlertDescription>
		</Alert>);
	}

	const locationName = locationQuery.data?.[0];

	if (weatherQuery.error || forecastQuery.error) {
		return (<Alert variant={'destructive'}>
			<AlertTriangle className={'size-4'}/>
			<AlertTitle>Error</AlertTitle>
			<AlertDescription className={'flex flex-col gap-4'}>
				<p>Failed to fetch weather data. Please try again.</p>
				<Button onClick={handleRefresh} variant={'outline'} className={'w-fit'}>
					<RefreshCw className={'mr-2 size-4'}/>
					Retry
				</Button>
			</AlertDescription>
		</Alert>);
	}

	if (!weatherQuery.data || !forecastQuery.data) {
		return <LoadingSkeleton/>;
	}

	const MotionCurrentWeather = motion.create(CurrentWeather);
	const MotionHourlyTemperature = motion.create(HourlyTemperature);
	const MotionWeatherDetails = motion.create(WeatherDetails);
	const MotionWeatherForecast = motion.create(WeatherForecast);
	const MotionSunDetails=motion.create(SunDetails);

	const fadeIn = (delay: number) => ({
		initial: {opacity: 0, y: 20},
		animate: {opacity: 1, y: 0, transition: {delay, duration: 0.5}},
	});

	return (
		<div className={'space-y-4 cursor-default'}>
			<FavouriteCities/>
			<div className={'flex items-center justify-between'}>
				<h1 className={'text-xl font-bold tracking-tight'}>My Location</h1>
				<RefreshLocationButton
					handleRefresh={handleRefresh}
					disabled={weatherQuery.isFetching || forecastQuery.isRefetching || forecastQuery.isFetching}
					weatherFetching={weatherQuery.isFetching}
				/>
			</div>

			<div className={'grid gap-6'}>
				<div className={'flex flex-col lg:flex-row gap-4'}>
					<MotionCurrentWeather {...fadeIn(0.2)} data={weatherQuery.data} location={locationName}/>
					<MotionHourlyTemperature {...fadeIn(0.4)} data={forecastQuery.data} isCityTemps={false}/>
				</div>
				<div className={'grid gap-4 md:grid-cols-2 items-start'}>
					<div className={'flex flex-col gap-6'}>
						<MotionSunDetails {...fadeIn(0.6)} sunriseTime={weatherQuery.data.sys.sunrise} sunsetTime={weatherQuery.data.sys.sunset}/>
						<MotionWeatherDetails {...fadeIn(0.7)} data={weatherQuery.data}/>
					</div>
					<MotionWeatherForecast {...fadeIn(0.8)} data={forecastQuery.data}/>
				</div>
			</div>
		</div>
	);
}

export default DashboardPage;