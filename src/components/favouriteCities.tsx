import {useFavourites} from "@/hooks/useFavourite.ts";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {useNavigate} from "react-router";
import {useWeatherQuery} from "@/hooks/useWeather.ts";
import {Button} from "@/components/ui/button.tsx";
import {Loader2, X} from "lucide-react";
import {toast} from "sonner";
import {motion} from "motion/react";
import {memo} from "react";

interface FavouriteCityCardProps {
	id: string;
	name: string;
	lat: number;
	lon: number;
	onRemove: (id: string) => void;
}

function FavouriteCityCard({id, name, lat, lon, onRemove}: FavouriteCityCardProps) {
	const navigate = useNavigate();
	const {data: weather, isLoading} = useWeatherQuery({lat, lon});

	return <motion.div
		whileHover={{scale: 1.03}}
		onClick={() => navigate(`/city/${name}?lat=${lat}&lon=${lon}`)}
		role={'button'}
		tabIndex={0}
		className={'relative flex min-w-[250px] cursor-pointer items-center gap-3 rounded-lg border bg-card p-4 pr-8 shadow-sm transition-all hover:shadow-md m-2 group'}
	>
		<Button
			variant={'ghost'}
			size={'icon'}
			onClick={(e) => {
				e.stopPropagation();
				onRemove(id);
				toast.error(`Removed ${name} from favourites`)
			}}
			className={'absolute right-1 top-1 size-6 rounded-full p-0 hover:text-destructive-foreground group-hover:opacity-100'}
		>
			<X className={'size-4'}/>
		</Button>
		{
			isLoading
				?
				(
					<div className={'flex h-8 items-center justify-center'}>
						<Loader2 className={'size-4 animate-spin'}/>
					</div>
				) : weather ? (
					<>
						<div className={'flex items-center gap-2'}>
							<img
								src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
								alt={weather.weather[0].description}
								className={'h-8 w-8'}
							/>
							<div>
								<p className={'font-medium'}>{name}</p>
								<p className={'text-xs text-muted-foreground'}>{weather.sys.country}</p>
							</div>
						</div>
						<div className={'ml-auto text-right'}>
							<p className={'text-xl font-bold'}>
								{Math.round(weather.main.temp)}°
							</p>
							<p className={'text-xs capitalize text-muted-foreground'}>
								{weather.weather[0].description}
							</p>
						</div>
					</>
				) : null
		}
	</motion.div>
}

function FavouriteCities() {

	const {favourites, removeFavourite} = useFavourites();

	return (
		<>
			<h1 className={'text-xl font-bold tracking-tight'}>Favourites</h1>
			{!favourites || favourites.length === 0 ? (
				<div className="text-center text-muted-foreground">
					<p>No cities added yet.</p>
				</div>
			) : (
				<ScrollArea className={'w-full pb-4'}>
					<div className={'flex gap-4'}>
						{favourites.map((city) => {
							return (
								<FavouriteCityCard
									key={city.id}
									{...city}
									onRemove={(id) => removeFavourite.mutate(id)}
								/>
							);
						})}
					</div>
				</ScrollArea>
			)}
		</>
	);
}

export default memo(FavouriteCities);