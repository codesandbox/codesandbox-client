import { PropertyDescriptorParsingType } from '../IPropertyDescriptor';
import { parseFunctionArgs } from '../syntax/parser';
import { isLengthPercentage, parseLengthPercentageTuple } from '../types/length-percentage';
export const backgroundPosition = {
    name: 'background-position',
    initialValue: '0% 0%',
    type: PropertyDescriptorParsingType.LIST,
    prefix: false,
    parse: (tokens) => {
        return parseFunctionArgs(tokens)
            .map((values) => values.filter(isLengthPercentage))
            .map(parseLengthPercentageTuple);
    }
};
