import Layout from "@/layouts/layout.tsx";
import {ThemeProvider} from "@/context/theme-provider.tsx";
import {createBrowserRouter, RouterProvider} from "react-router";
import DashboardPage from "@/pages/dashboardPage.tsx";
import CityPage from "@/pages/cityPage.tsx";
import {QueryClientProvider, QueryClient} from "@tanstack/react-query";
import {Toaster} from "@/components/ui/sonner.tsx";

const queryClient = new QueryClient({
	defaultOptions:{
		queries:{
			staleTime: 1000 * 60 * 5,
			gcTime: 1000 * 60 * 10,
			refetchOnWindowFocus: false,
			refetchOnReconnect: false,
			retry: 1,
		}
	}
});

function App() {

	const router = createBrowserRouter([
		{
			Component: Layout,
			children: [
				{index: true, Component: DashboardPage},
				{path: '/city/:cityName', Component: CityPage}
			]
		}
	]);

	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider defaultTheme={'dark'}>
				<RouterProvider router={router}/>
				<Toaster richColors/>
			</ThemeProvider>
		</QueryClientProvider>
	);
}

export default App;