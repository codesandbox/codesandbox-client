import * as React from 'react';
import Downshift from 'downshift';
import { Pagination } from 'react-instantsearch/dom';
import DependencyHit from '../DependencyHit';
import { AutoCompleteInput } from './elements';
import { Hit } from '../DependencyHit';

type Props = {
    onSelect: () => void;
    onManualSelect: (value: string) => void;
    onHitVersionChange: (hit: Hit, version: string) => void;
    hits: Hit[];
    refine: (value: string) => void;
    currentRefinement: string;
};

const RawAutoComplete: React.SFC<Props> = ({
    onSelect,
    onManualSelect,
    onHitVersionChange,
    hits,
    refine,
    currentRefinement
}) => {
    return (
        <Downshift itemToString={(hit) => (hit ? hit.name : hit)} onSelect={onSelect}>
            {({ getInputProps, getItemProps, highlightedIndex }) => (
                <div>
                    <AutoCompleteInput
                        {...getInputProps({
                            ref(ref) {
                                if (ref) {
                                    ref.focus();
                                }
                            },
                            value: currentRefinement,
                            placeholder: 'Search or enter npm dependency',
                            onChange(e: React.ChangeEvent<HTMLInputElement>) {
                                refine(e.target.value);
                            },
                            onKeyUp(e: any) {
                                // If enter with no selection
                                if (e.keyCode === 13) {
                                    onManualSelect(e.target.value);
                                }
                            }
                        })}
                    />
                    <Pagination />

                    <div>
                        {hits.map((hit, index) => (
                            <DependencyHit
                                key={hit.name}
                                {...getItemProps({
                                    item: hit,
                                    index,
                                    highlighted: highlightedIndex === index,
                                    hit,
                                    // Downshift supplies onClick
                                    onVersionChange(version) {
                                        onHitVersionChange(hit, version);
                                    }
                                })}
                            />
                        ))}
                    </div>
                </div>
            )}
        </Downshift>
    );
};

export default RawAutoComplete;
