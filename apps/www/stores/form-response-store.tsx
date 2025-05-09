import { AllowedResponse } from '@/types/response';
import { createStore } from 'zustand/vanilla'
import { devtools } from 'zustand/middleware'

export type FormResponseState = {
    formId: string;
    response: AllowedResponse[];
    requiredQuestions: { questionId: string; value: boolean; pageIndex: number }[];
    selectedPage: number;
}

export type FormResponseActions = {
    respond: (response: AllowedResponse) => void;
    unrespond: (questionId: string) => void;
    updateResponse: (questionId: string, response: AllowedResponse) => void;
    setResponses: (response: AllowedResponse[]) => void;
    setRequiredQuestions: (requiredQuestions: { questionId: string; pageIndex: number }[]) => void;
    markRequired: (questionId: string, pageIndex: number, value?: boolean) => void;
    isRequired: (questionId: string) => boolean;
    clearRequired: () => void;
    setSelectedPage: (pageIndex: number | ((prev: number) => number)) => void;
}

export type FormResponseStore = FormResponseState & FormResponseActions

export const defaultInitState: FormResponseState = {
    formId: '',
    response: [],
    requiredQuestions: [],
    selectedPage: 0,
}

export const createFormResponseStore = (
    initState: FormResponseState = defaultInitState,
) => {
    return createStore<FormResponseStore>()(
        devtools(
            (set, get) => ({
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

                markRequired: (questionId: string, pageIndex: number, value: boolean = true) =>
                    set((state) => {
                        // Filter out any null/undefined values
                        const filteredResponses = state.requiredQuestions.filter(Boolean);
                        const exists = filteredResponses.some(r => r.questionId === questionId);
                        if (exists) {
                            return {
                                requiredQuestions: filteredResponses.map(r =>
                                    r.questionId === questionId ? { ...r, value } : r
                                )
                            };
                        } else {
                            return {
                                requiredQuestions: [...filteredResponses, { questionId, value, pageIndex }]
                            };
                        }
                    }),

                clearRequired: () =>
                    set(() => ({
                        requiredQuestions: []
                    })),

                isRequired: (questionId: string) =>
                    get().requiredQuestions.find(r => r.questionId === questionId)?.value || false,

                setSelectedPage: (pageIndex: number | ((prev: number) => number)) =>
                    set((state) => ({
                        selectedPage: typeof pageIndex === 'function' ? pageIndex(state.selectedPage) : pageIndex
                    })),
            }),
            {
                name: 'formResponseStore'
            }
        )
    )
}
