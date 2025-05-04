import { AllowedResponse } from '@/types/response';
import { createStore } from 'zustand/vanilla'
import { devtools } from 'zustand/middleware'

export type FormResponseState = {
    formId: string;
    response: AllowedResponse[];
}

export type FormResponseActions = {
    respond: (response: AllowedResponse) => void;
    unrespond: (questionId: string) => void;
    updateResponse: (questionId: string, response: AllowedResponse) => void;
    setResponses: (response: AllowedResponse[]) => void;
}

export type FormResponseStore = FormResponseState & FormResponseActions

export const defaultInitState: FormResponseState = {
    formId: '',
    response: [],
}

export const createFormResponseStore = (
    initState: FormResponseState = defaultInitState,
) => {
    return createStore<FormResponseStore>()(
        devtools(
            (set) => ({
                // Initialize with the provided initial state
                ...initState,

                // Update an existing response that matches the questionId
                respond: (response: AllowedResponse) =>
                    set((state) => {
                        // Filter out any null/undefined values
                        const filteredResponses = state.response.filter(Boolean);
                        const exists = filteredResponses.some(r => r.questionId === response.questionId);
                        if (exists) {
                            return {
                                response: filteredResponses.map(r =>
                                    r.questionId === response.questionId ? response : r
                                )
                            };
                        } else {
                            return {
                                response: [...filteredResponses, response]
                            };
                        }
                    }),

                // Remove a response with the specified questionId
                unrespond: (questionId: string) =>
                    set((state) => ({
                        response: state.response.filter(r => r.questionId !== questionId)
                    })),

                // Replace all responses with a new array
                setResponses: (response: AllowedResponse[]) =>
                    set(() => ({
                        response: response
                    })),
            }),
            {
                name: 'formResponseStore'
            }
        )
    )
}
