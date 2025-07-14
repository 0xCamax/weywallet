export function updateBadge(count: number) {
	if (count > 0) {
		chrome.action.setBadgeText({ text: count.toString() });
		chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });
		chrome.sidePanel.setPanelBehavior({
			openPanelOnActionClick: true,
		});
	} else {
		chrome.action.setBadgeText({ text: '' });
		chrome.sidePanel.setPanelBehavior({
			openPanelOnActionClick: false,
		});
	}
}
