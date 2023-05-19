import * as tablerIcons from '@tabler/icons-react';

import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

export default function save(props) {
	const { attributes } = props;
	const { tabLabelsArray, sideTabLayout, tabIconArray } = attributes;

	const blockProps = useBlockProps.save({
		className: sideTabLayout ? "side-tab-layout" : "",
	});

	return (
		<div {...blockProps}>
			<ul className="tab-labels" role="tablist" aria-label="tabbed content">
				{tabLabelsArray.map((label, i) => {
					return (
						<li
							key={i}
							className={i === 0 ? "tab-label active" : "tab-label"}
							role="tab"
							aria-selected={i === 0 ? "true" : "false"}
							aria-controls={label}
							tabindex="0"
						>
							{tablerIcons[tabIconArray[i]] && createElement(tablerIcons[tabIconArray[i]], { className: 'tab-icon' })}

							{label}
						</li>
					);
				})}
			</ul>
			<div className="tab-content">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
