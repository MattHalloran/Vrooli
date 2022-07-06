import { OutputItemCreateInput, OutputItemTranslationCreateInput, OutputItemTranslationUpdateInput, OutputItemUpdateInput } from "graphql/generated/globalTypes";
import { RoutineOutput, RoutineOutputTranslation } from "types";
import { formatForUpdate, hasObjectChanged, shapeStandardCreate } from "utils";
import { shapeCreateList, shapeUpdateList, ShapeWrapper } from "./shapeTools";

type OutputTranslationCreate = ShapeWrapper<RoutineOutputTranslation> &
    Pick<OutputItemTranslationCreateInput, 'language' | 'description'>;
/**
 * Format an output's translations for create mutation.
 * @param translations Translations to format
 * @returns Formatted translations
 */
export const shapeOutputTranslationsCreate = (
    translations: OutputTranslationCreate[] | null | undefined
): OutputItemTranslationCreateInput[] | undefined => shapeCreateList(translations, (translation) => ({
    id: translation.id,
    language: translation.language,
    description: translation.description,
}))

interface OutputTranslationUpdate extends OutputTranslationCreate { id: string };
/**
 * Format an output's translations for update mutation.
 * @param original Original translations list
 * @param updated Updated translations list
 * @returns Formatted translations
 */
export const shapeOutputTranslationsUpdate = (
    original: OutputTranslationUpdate[] | null | undefined,
    updated: OutputTranslationUpdate[] | null | undefined
): {
    translationsCreate?: OutputItemTranslationCreateInput[],
    translationsUpdate?: OutputItemTranslationUpdateInput[],
    translationsDelete?: string[],
} => shapeUpdateList(
    original,
    updated,
    'translations',
    shapeOutputTranslationsCreate,
    hasObjectChanged,
    formatForUpdate as (original: OutputTranslationCreate, updated: OutputTranslationCreate) => OutputItemTranslationUpdateInput | undefined,
)

type OutputCreate = ShapeWrapper<RoutineOutput> &
    Pick<RoutineOutput, 'translations' | 'standard'>;
/**
 * Format an output list for create mutation.
 * @param outputs The output list's information
 * @returns Output list shaped for create mutation
 */
export const shapeOutputsCreate = (
    outputs: OutputCreate[] | null | undefined
): OutputItemCreateInput[] | undefined => shapeCreateList(outputs, (output) => ({
    id: output.id,
    name: output.name,
    ...shapeOutputTranslationsCreate(output.translations),
    ...shapeStandardCreate(output.standard),
}))

interface OutputUpdate extends OutputCreate { id: string };
/**
 * Format an output list for update mutation.
 * @param original Original output list
 * @param updated Updated output list
 * @returns Formatted output list
 */
export const shapeOutputsUpdate = (
    original: OutputUpdate[] | null | undefined,
    updated: OutputUpdate[] | null | undefined,
): {
    outputsCreate?: OutputItemCreateInput[],
    outputsUpdate?: OutputItemUpdateInput[],
    outputsDelete?: string[],
} => shapeUpdateList(
    original,
    updated,
    'outputs',
    shapeOutputsCreate,
    hasObjectChanged,
    (o: OutputUpdate, u: OutputUpdate) => {
        // Connect to standard if it's marked as external. 
        // Otherwise, set as create. The backend will handle the rest, even if 
        // you're updating.
        const shouldConnectToStandard = u.standard && !u.standard.isInternal && u.standard.id;
        return {
            id: o.id,
            name: u.name,
            standardConnect: shouldConnectToStandard ? u.standard?.id as string : undefined,
            standardCreate: !shouldConnectToStandard ? shapeStandardCreate(u.standard) : undefined,
            ...shapeOutputTranslationsUpdate(o.translations, u.translations),
        }
    }
);