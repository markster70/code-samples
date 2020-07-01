import Vue from 'vue';

export default {

    //  LOGIN MUTATIONS

    SET_USER_DATA(state, userData) {
        state.currentUser = userData;
        localStorage.setItem('user', JSON.stringify(userData));
    },
    CLEAR_USER_DATA() {
        localStorage.removeItem('user');
        location.reload()
    },

    // TOTAL INTAKE MUTATIONS

    SET_INTAKE_LOCATIONS(state, locationsArray) {
        state.intakeLocations = locationsArray;
    },
    SET_INTAKE_STATUSES(state, statusesArray) {
        state.intakeStatuses = statusesArray;
    },
    SET_INTAKE_DATA(state, intakeObj) {

        if(state.applicantData.length > 0) {
            state.applicantData = [];
        }

        for (let i = 0; i < intakeObj.length; i++) {
            let intakeObject = intakeObj[i];
            state.applicantData.push(intakeObject);
        }
    },

    // CURRENT INTAKE MUTATIONS

    SET_CURRENT_INTAKE_DATA(state, intakeItem) {

        state.currentIntake = intakeItem;
    },
    CLEAR_CURRENT_INTAKE_DATA(state) {
        state.currentIntake = null;
        state.selectedApplicants = [];
    },

    // INTAKE UPLOAD MUTATIONS

    START_APPLICANT_UPLOAD(state, intakeId) {
        state.applicantUploadRequired = true;

        if (intakeId) {
            state.intakeUpdateActive = true;
            state.intakeUpdateId = intakeId;
        }

    },
    END_APPLICANT_UPLOAD(state) {
        state.applicantUploadRequired = false;
        state.intakeUpdateActive = false;
    },

    // SELECTED APPLICANT MUTATIONS

    SET_SELECTED_APPLICANTS(state, applicant) {
        state.selectedApplicants.push(applicant);
    },
    REMOVE_SELECTED_APPLICANT(state, applicantId) {

        // loop through the selected applicants array here
        for (let i = 0; i < state.selectedApplicants.length; i++) {
            // get a reference to the current array item
            let arrayItem = state.selectedApplicants[i];
            // if the array item id = the applicant Id passed to this mutation
            if (arrayItem.candidateId === applicantId) {
                // we have the correct index with which to splice the array
                state.selectedApplicants.splice(i, 1);

            }
        }

    },
    CLEAR_ALL_SELECTED_APPLICANTS(state) {
        state.selectedApplicants = [];
    },

    // SELECTED INTAKE MUTATIONS

    DELETE_SELECTED_INTAKE(state, intakeId) {

        // loop through the selected applicants array here
        for (let i = 0; i < state.applicantData.length; i++) {
            // get a reference to the current array item
            let arrayItem = state.applicantData[i];
            // if the array item id = the applicant Id passed to this mutation
            if (arrayItem.intakeId === intakeId) {
                // we have the correct index with which to splice the array
                state.applicantData.splice(i, 1);

            }
        }
    },
    UPDATE_SELECTED_INTAKE(state, payload) {


        for (let i = 0; i < state.applicantData.length; i++) {

            let currentDataSet = state.applicantData[i];

            if (currentDataSet.intakeId === state.intakeUpdateId) {

                for (let [key, value] of Object.entries(payload)) {
                    currentDataSet[key] = value;
                }
            }
        }

        state.intakeUpdateId = null;
        state.intakeUpdateActive = false;

    },

    // OFF CANVAS MUTATIONS

    SET_OFF_CANVAS_CONTENT(state, componentPayload) {

        state.offCanvas.title = componentPayload.title;
        state.offCanvas.component = componentPayload.name;
        state.offCanvas.params = componentPayload.params;
    },
    MANAGE_OFF_CANVAS(state, offCanvasStatus) {

        state.offCanvas.isActive = offCanvasStatus;
    },
    SET_OFF_CANVAS_LOADING (state) {

        state.offCanvas.isLoading = true;
    },
    UNSET_OFF_CANVAS_LOADING (state) {
        state.offCanvas.isLoading = false;
    },

    // DETAIL TABLE FILTER MUTATIONS

    ADD_DETAIL_TABLE_FILTER(state, filterPayload) {

        Vue.set(state.detailTableFilters, filterPayload.operatorName, filterPayload.operatorValue);
    },
    RESET_ALL_DETAIL_TABLE_FILTERS(state) {

        for (let prop in state.detailTableFilters) {
            if (state.detailTableFilters.hasOwnProperty(prop)) {
                state.detailTableFilters[prop] = state.detailTableFilters.defaultFilterValue;
            }
        }
    },

    // SHORTLISTING MUTATIONS

    SET_SHORTLIST_APPLICANTS(state, applicantIdArray) {


        if (applicantIdArray.length > 0 && !state.currentIntake.hasShortList) {
            Vue.set(state.currentIntake, 'hasShortList', 0);
        }

        let currentIntake = state.currentIntake.intakeItems;


        for (let i = 0; i < applicantIdArray.length; i++) {

            let applicantItemCandidateId = applicantIdArray[i];

            for (let j =0; j < currentIntake.length; j ++) {
                let intakeItem = currentIntake[j];

                if(applicantItemCandidateId === intakeItem.candidateId && !intakeItem.shortListed ) {

                    Vue.set(intakeItem, 'shortListed', true);
                    state.currentIntake.hasShortList++;
                }
            }
        }

    },
    REMOVE_SHORTLIST_APPLICANT(state, applicantIdArray) {

        // ive used the applicantIdArray pattern to pass in as a param here so that the API call function in the apiService doesnt get any more convoluted
        // in reality, the applicantIdArray passed to this function is only ever going to have a single value,
        // so applicantIdArray[0] can be used for the match as the iteration through the current Intake proceeds in the loop below

        // loop through the selected applicants array here
        for (let i = 0; i < state.currentIntake.intakeItems.length; i++) {

            // get a reference to the current array item
            let arrayItem = state.currentIntake.intakeItems[i];
            // if the array item id = the applicant Id passed to this mutation
            if (arrayItem.candidateId === applicantIdArray[0]) {
                // we have the correct index with which to set the selection to false
                Vue.set(arrayItem, 'shortListed', false);
            }
        }

        if (state.currentIntake.hasShortList > 0) {
            state.currentIntake.hasShortList--;
        } else {
            Vue.set(state.currentIntake, 'hasShortList', 0);
        }

    },
    SET_SHORTLIST_CONFIRMATION(state) {
        state.shortListConfirmationActive = !state.shortListConfirmationActive;
    },
    MANAGE_SHORTLIST_VIEW(state, shortListViewStatus) {
        state.shortListViewActive = shortListViewStatus;
    },

    // PREDICTION DETAIL DRILL DOWN MUTATIONS

    SET_SELECTED_CANDIDATE_PERSONALITY_DETAIL (state,personalityDetail) {

        state.selectedCandidatePersonalityDetail = personalityDetail[0];
    },
    UNSET_SELECTED_CANDIDATE_PERSONALITY_DETAIL (state) {

        // reset the state item here
        state.selectedCandidatePersonalityDetail = null;
    },
    SET_SELECTED_CANDIDATE_MATH_DETAIL (state,mathDetail) {

        state.selectedCandidateMathDetail = mathDetail[0];
    },
    UNSET_SELECTED_CANDIDATE_MATH_DETAIL (state) {

        // reset the state item here
        state.selectedCandidateMathDetail = null;
    },
    SET_SELECTED_CANDIDATE_VIDEO_DETAIL (state,videoDetail) {

        state.selectedCandidateVideoDetail = videoDetail;
    },
    UNSET_SELECTED_CANDIDATE_VIDEO_DETAIL (state) {

        // reset the state item here
        state.selectedCandidateVideoDetail = null;
    },
    SET_SELECTED_CANDIDATE_PREDICTIONS_DETAIL (state,predictionsDetail) {

        state.selectedCandidatePredictionsDetail = predictionsDetail;
    },
    UNSET_SELECTED_CANDIDATE_PREDICTIONS_DETAIL (state) {

        // reset the state item here
        state.selectedCandidatePredictonsDetail = null;
    },

    // COMPLIANCE MUTATIONS

    SET_COMPLIANCE_DATA(state, complianceObj) {

        if(state.complianceData.length > 0) {
            state.complianceData = [];
        }

        for (let i = 0; i < complianceObj.length; i++) {
            let complianceObject = complianceObj[i];
            state.complianceData.push(complianceObject);
        }
    },
    SET_COMPLIANCE_CANDIDATE(state, applicant) {
        state.selectedComplianceCandidates.push(applicant);
    },
    REMOVE_COMPLIANCE_CANDIDATE(state, candidateId) {


        // loop through the selected applicants array here
        for (let i = 0; i < state.selectedComplianceCandidates.length; i++) {
            // get a reference to the current array item
            let arrayItem = state.selectedComplianceCandidates[i];
            // if the array item id = the applicant Id passed to this mutation
            if (arrayItem.id === candidateId) {
                // we have the correct index with which to splice the array
                state.selectedComplianceCandidates.splice(i, 1);
            }
        }
    },
    DELETE_COMPLIANCE_CANDIDATE(state,candidateId) {

        // loop through the selected applicants array here
        for (let i = 0; i < state.complianceData.length; i++) {
            // get a reference to the current array item
            let arrayItem = state.complianceData[i];
            // if the array item id = the applicant Id passed to this mutation
            if (arrayItem.id === candidateId) {
                // we have the correct index with which to splice the array
                state.complianceData.splice(i, 1);
            }
        }

    },

    CLEAR_ALL_COMPLIANCE_CANDIDATES(state) {
        state.selectedComplianceCandidates = [];
    },
    SET_COMPLIANCE_CONFIRMATION(state) {
        state.complianceConfirmationActive = !state.complianceConfirmationActive;
    },

    // GENERAL ERROR MUTATIONS

    SET_NETWORK_ERROR(state) {
        state.networkError = true;
    },
    SET_API_ERROR(state) {
        state.apiError = !state.apiError;
    },
}