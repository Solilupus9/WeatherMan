import {isRouteErrorResponse, useRouteError} from "react-router";

function ErrorPage() {
	const error = useRouteError();

	if (isRouteErrorResponse(error)) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] text-center">
				<h1 className="text-4xl font-bold text-destructive mb-4">{error.status}</h1>
				<p className="text-xl text-muted-foreground mb-4">{error.statusText}</p>
				{error.data && <p className="text-muted-foreground">{error.data}</p>}
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-[400px] text-center">
			<h1 className="text-2xl font-bold text-destructive mb-4">Oops! Something went wrong while displaying the dashboard!</h1>
			<p className="text-muted-foreground">
				{error instanceof Error ? error.message : "An unexpected error occurred"}
			</p>
		</div>
	);
}
 export default ErrorPage;