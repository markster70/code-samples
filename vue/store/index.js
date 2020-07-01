import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';


Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        currentUser: null,
        applicationLoading : false,
        networkError : false,
        apiError: false,
        applicantData: [],
        intakeLocations: null,
        intakeStatuses: null,
        intakeUpdateActive: false,
        intakeUpdateId: null,
        currentIntake: null,
        applicantUploadRequired: false,
        selectedApplicants: [],
        maxSelectedApplicants: 5,
        shortListConfirmationActive: false,
        shortListViewActive: false,
        offCanvas: {
            isLoading : false,
            isActive: false,
            component: null,
            title: null,
            params: null
        },
        detailTableFilters: {
            defaultFilterValue: '===',
            appTableAppScoreFilter: '===',
            appTableMathsTestFilter: '===',
            appTableVidScoreFilter: '===',
            appTableAssessmentScoreFilter: '===',
            appTableMathsScoreFilter: '===',
            plRebatesScore: '===',
            bonusDetailFilterFilter: '===',
            hardStopLimitFilter: '===',
            PlFilter: '==='
        },
        selectedCandidatePersonalityDetail : null,
        selectedCandidateMathDetail : null,
        selectedCandidateVideoDetail : null,
        selectedCandidatePredictionsDetail : null,
        complianceData : [],
        selectedComplianceCandidates : [],
        complianceConfirmationActive : false
    },
    mutations: mutations,
    actions: actions,
    getters: getters
})
