//import
import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";


export default function save(props) {
	const { attributes} = props;
	const { tabLabelsArray, sideTabLayout } = attributes;

	var blockProps = useBlockProps.save();

	if (sideTabLayout) {
		blockProps = useBlockProps.save({
			className: "side-tab-layout",
		});
	}

	return (
		<div {...blockProps}>
			<ul className="tab-labels" role="tablist" aria-label="tabbed content">
				{tabLabelsArray.map((label, i) => {
					return (
						<li
							className={i == 0 ? "tab-label active" : "tab-label"}
							role="tab"
							aria-selected={i == 0 ? "true" : "false"}
							aria-controls={label}
							tabindex="0"
						>
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
