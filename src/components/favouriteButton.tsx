import type {WeatherData} from "@/api/types.ts";
import {useFavourites} from "@/hooks/useFavourite.ts";
import {Button} from "@/components/ui/button.tsx";
import {Star} from "lucide-react";
import {toast} from "sonner";
import {useState} from "react";

interface FavouriteButtonProps {
	data:WeatherData
}

function FavouriteButton({data}: FavouriteButtonProps) {

	const {addToFavourite,removeFavourite,isFavourite} = useFavourites();
	const [isCurrentlyFavourite, setIsCurrentlyFavourite] = useState(isFavourite(data.coord.lat, data.coord.lon))

	function handleToggleFavourite(){
		if(isCurrentlyFavourite){
			removeFavourite.mutate(`${data.coord.lat}-${data.coord.lon}`);
			setIsCurrentlyFavourite(false);
			toast.error(`Removed ${data.name} from favourites`);
		}
		else{
			addToFavourite.mutate({
				name: data.name,
				lat: data.coord.lat,
				lon: data.coord.lon,
				country: data.sys.country,
			});
			setIsCurrentlyFavourite(true);
			toast.success(`Added ${data.name} to favourites`);
		}
	}

	return (
		<Button
			variant={isCurrentlyFavourite?'default':'outline'}
			size={'icon'}
			className={isCurrentlyFavourite?'bg-yellow-500 hover:bg-yellow-600':''}
			onClick={handleToggleFavourite}
		>
			<Star className={`h-4 w-4 ${isCurrentlyFavourite ? "fill-current" : ""}`}/>
		</Button>
	);
}

export default FavouriteButton;