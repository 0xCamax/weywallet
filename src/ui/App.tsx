import { useRouter } from './context/hooks/index.tsx';
import { Footer } from './views/components/base/Footer.tsx';
import { Header } from './views/components/base/Header.tsx';


type Prop = {
	sidepanel?: boolean;
};

export const App = ({ sidepanel }: Prop) => {
	const { popupView, sidepanelView, render } = useRouter();


	return (
		<main
			className="m-0 p-0 h-full flex flex-col justify-between overflow-x-hidden overflow-y-scroll"
			style="-webkit-scrollbar: none;-ms-overflow-style: none;scrollbar-width: none;"
		>
			<div className="flex-[1]">
				<Header />
			</div>
			<div className="flex justify-center flex-[8]">
				{sidepanel ? render(sidepanelView) : render(popupView)}
			</div>
			<div className="flex-[1] mt-5">
				<Footer />
			</div>
		</main>
	);
};
