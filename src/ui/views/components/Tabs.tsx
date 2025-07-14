import { useState } from 'preact/hooks';
import { useRouter } from '../../context/hooks/index.tsx';

type Props = {
	tabs: string[];
};

export const Tabs = ({ tabs }: Props) => {
	const [activeTab, setActiveTab] = useState<number>(0);
	const [fade, setFade] = useState<boolean>(false);
	const { render } = useRouter();

	const handleTabClick = (tabIndex: number) => {
		if (tabIndex !== activeTab) {
			setFade(true);
			setTimeout(() => {
				setActiveTab(tabIndex);
				setFade(false);
			}, 150);
		}
	};

	return (
		<div className="w-full max-w-xl flex flex-col justify-center items-center">
			<div role="tablist" className="tabs tabs-border w-full">
				{tabs.map((tab, i) => (
					<a
						key={i}
						role="tab"
						className={`tab transition-all duration-200 ${activeTab === i ? 'tab-active' : ''}`}
						onClick={() => handleTabClick(i)}
						aria-selected={activeTab === i}
					>
						{tab}
					</a>
				))}
			</div>

			<div
				className={`flex justify-center mt-1 w-11/12 transition-all duration-300 ${
					fade ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
				}`}
			>
				{render(tabs[activeTab])}
			</div>
		</div>
	);
};