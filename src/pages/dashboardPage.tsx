import {Button} from "@/components/ui/button.tsx";
import {AlertTriangle, MapPin, RefreshCw} from "lucide-react";
import {useGeolocation} from "@/hooks/useGeolocation.ts";
import LoadingSkeleton from "@/components/loading-skeleton.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {useForecastQuery, usePollutionQuery, useReverseGeocodeQuery, useWeatherQuery} from "@/hooks/useWeather.ts";
import FavouriteCities from "@/components/favouriteCities.tsx";
import RefreshLocationButton from "@/components/refreshLocationButton.tsx";
import {useCallback, useEffect} from "react";
import {MotionCurrentWeather, MotionHourlyTemperature,MotionPollutionDetails, MotionSunDetails, MotionWeatherDetails, MotionWeatherForecast} from "@/components/motionComponents.tsx";

function DashboardPage() {

	const {coordinates, error, getLocation, isLoading} = useGeolocation();

	const locationQuery = useReverseGeocodeQuery(coordinates);
	const weatherQuery = useWeatherQuery(coordinates);
	const forecastQuery = useForecastQuery(coordinates);
	const pollutionQuery = usePollutionQuery(coordinates);

	const handleRefresh = useCallback(() => {
		getLocation();
		if (coordinates) {
			weatherQuery.refetch();
			forecastQuery.refetch();
			locationQuery.refetch();
			pollutionQuery.refetch();
		}
	}, [getLocation, coordinates, weatherQuery, forecastQuery, locationQuery,pollutionQuery]);

	useEffect(() => {
		const interval = setInterval(() => {
			console.log('Refreshing location data...');
			handleRefresh();
		}, 15 * 60 * 1000);

		return () => clearInterval(interval);
	}, [coordinates, handleRefresh]);


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

	if (!weatherQuery.data || !forecastQuery.data || !pollutionQuery.data) {
		return <LoadingSkeleton/>;
	}

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
				<div className={'grid gap-4 md:grid-cols-2'}>
					<div className={'flex flex-col gap-6'}>
						<MotionSunDetails whileHover={{scale: 1.01}} {...fadeIn(0.6)}
						                  sunriseTime={weatherQuery.data.sys.sunrise}
						                  sunsetTime={weatherQuery.data.sys.sunset}/>
						<MotionWeatherDetails whileHover={{scale: 1.01}} {...fadeIn(0.7)} data={weatherQuery.data}/>
					</div>
					<MotionWeatherForecast whileHover={{scale: 1.01}} {...fadeIn(0.8)} data={forecastQuery.data}/>
				</div>
				<div className={'w-full'}>
					<MotionPollutionDetails whileHover={{scale: 1.01}} {...fadeIn(1)} data={pollutionQuery.data}/>
				</div>
			</div>
		</div>
	);
}

export default DashboardPage;