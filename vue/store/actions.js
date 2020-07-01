import apiService from '@/apiService/apiService';
import fetchIntakes from "@/apiService/fetchIntakes";

export default {
    login({commit}, data) {
        commit('SET_USER_DATA', data)
    },
    logout({commit}) {
        commit('CLEAR_USER_DATA');
    },
    setIntakeLocations({commit}, data) {
        commit('SET_INTAKE_LOCATIONS', data);
    },
    setIntakeStatuses({commit}, data) {
        commit('SET_INTAKE_STATUSES', data);
    },
    setIntakeData({commit}, data) {
        commit('SET_INTAKE_DATA', data);
    },
    setCurrentIntakeItem({commit, getters, dispatch}, id) {

        let currentIntake = getters.getIntakeById(id);
        let shortListCount = 0;


        return apiService.fetchIntakeById(id)
            .then(response => {

                for(let i =0 ; i < response.data.length; i++) {
                    let hasSl = response.data[i]['shortListed'];

                    if(hasSl) {
                        shortListCount ++;
                    }
                }


                let currentIntakeObj = {
                    intakeTitle : currentIntake.intakeTitle,
                    intakeItems : response.data,
                    intakeLocation: currentIntake.intakeLocation,
                    intakeStatus: currentIntake.intakeStatus,
                    intakeDate: currentIntake.intakeDate,
                    hasShortList : shortListCount
                };

                commit('SET_CURRENT_INTAKE_DATA', currentIntakeObj);

            })
            .catch(() => {
                dispatch('setNetworkError');
            });

    },
    clearCurrentIntakeItem({commit}) {
        commit('CLEAR_CURRENT_INTAKE_DATA');
    },
    updateExistingIntakeData({commit}, updatePayload) {


        return apiService.updateIntake(updatePayload.intakeId, updatePayload.intakeTitle, updatePayload.intakeLocation, updatePayload.intakeStatus)
            .then(() => {

                commit('UPDATE_SELECTED_INTAKE', updatePayload);
            }).catch(() => {
                // request failed
            });


    },
    startApplicantUpload({commit}, intakeId) {
        commit('START_APPLICANT_UPLOAD', intakeId);

    },
    endApplicantUpload({commit}) {
        commit('END_APPLICANT_UPLOAD');
    },
    addSelectedApplicant({commit}, applicantItem) {
        commit('SET_SELECTED_APPLICANTS', applicantItem);
    },
    removeSelectedApplicant({commit, getters}, applicantId) {

        let applicantToRemove = getters.getApplicantById(applicantId);

        commit('REMOVE_SELECTED_APPLICANT', applicantToRemove.candidateId);

    },
    removeAllSelectedApplicants({commit}) {
        commit('CLEAR_ALL_SELECTED_APPLICANTS');
    },
    deleteSelectedIntake({commit}, intakeId) {

        return apiService.deleteIntake(intakeId)
            .then(() => {

                commit('DELETE_SELECTED_INTAKE', intakeId);
                fetchIntakes.getIntakes();
            }).catch(() => {
                // request failed
            });


    },
    setOffCanvasComponent({dispatch, commit}, componentPayload) {

        commit('SET_OFF_CANVAS_CONTENT', componentPayload);
        dispatch('manageOffCanvas', true);
    },
    manageOffCanvas({commit}, offCanvasStatus) {
        commit('MANAGE_OFF_CANVAS', offCanvasStatus);

    },
    setOffCanvasLoading({commit}) {
        commit('SET_OFF_CANVAS_LOADING');
    },
    unsetOffCanvasLoading({commit}) {

        setTimeout(() => {
            commit('UNSET_OFF_CANVAS_LOADING');
        }, 2000)
    },
    setFilterObject({commit}, filterPayloadObj) {
        commit('ADD_DETAIL_TABLE_FILTER', filterPayloadObj);
    },
    resetAllDetailFilters({commit}) {
        commit('RESET_ALL_DETAIL_TABLE_FILTERS');
    },
    addToShortList({commit}, applicantIdArray) {


        return apiService.manageApplicantShortListing(true,applicantIdArray)
            .then(() => {
                // commit the applicant shortlisting mutation
                commit('SET_SHORTLIST_APPLICANTS', applicantIdArray);
                // and call the action to toggle the shortlist notification
            }).catch(() => {
                // request failed
                //console.log('failed');
            });

    },
    toggleShortListConfirmation({commit}) {
        // this action calls the mutation to set the shortlist confirmation notification
        commit('SET_SHORTLIST_CONFIRMATION');
        // and then calls again 5 seconds later which resets the value back to false
        setTimeout(() => {
            commit('SET_SHORTLIST_CONFIRMATION');
        }, 5000)
    },
    removeFromShortList({commit}, applicantIdArray) {

        return apiService.manageApplicantShortListing(false,applicantIdArray)
            .then(() => {
                // commit the applicant shortlisting mutation
                commit('REMOVE_SHORTLIST_APPLICANT', applicantIdArray);
                // and call the action to toggle the shortlist notification
            }).catch(() => {
                // request failed
                //console.log('failed');
            });


    },
    manageShortListView({commit}, shortListViewStatus) {
        commit('MANAGE_SHORTLIST_VIEW', shortListViewStatus);

    },
    setNetworkError ({commit}) {
        commit('SET_NETWORK_ERROR');
    },
    setSelectedCandidatePersonalityDetail ({commit, dispatch}, candidateId) {

        dispatch('unsetSelectedCandidatePersonalityDetail');

        return apiService.fetchPersonalityDetailByCandidate(candidateId)
            .then(response => {
                commit('SET_SELECTED_CANDIDATE_PERSONALITY_DETAIL', response.data);
                dispatch('unsetOffCanvasLoading');
            }).catch(() => {
                // request failed
            });

    },
    unsetSelectedCandidatePersonalityDetail ({commit}) {
        commit('UNSET_SELECTED_CANDIDATE_PERSONALITY_DETAIL');
    },
    setSelectedCandidateMathDetail ({commit, dispatch}, candidateId) {

        dispatch('unsetSelectedCandidateMathDetail');

        return apiService.fetchMathsDetailByCandidate(candidateId)
            .then(response => {
                commit('SET_SELECTED_CANDIDATE_MATH_DETAIL', response.data);
                dispatch('unsetOffCanvasLoading');
            }).catch(() => {
                // request failed
            });

    },
    unsetSelectedCandidateMathDetail ({commit}) {
        commit('UNSET_SELECTED_CANDIDATE_MATH_DETAIL');
    },
    setSelectedCandidateVideoDetail ({commit, dispatch}, candidateId) {

        dispatch('unsetSelectedCandidateVideoDetail');

        // the response from the api does not split the video interview details by category so I've had to do it here for now
        // server side would probably be far more efficient tbh

        return apiService.fetchVideoDetailByCandidate(candidateId)
            .then(response => {


                // get the response
                let responseObj = response.data[0];

                // find the score Description of the first item in the array
                let scoreDescription = responseObj.candidateScores[0].scoreDescription;
                // create a new array to hold values
                let newObj = [];
                // eslint is crap at recognising lets used in a loop so disabling or will fall over build - it';s a count for the categories
                // to work out which obj in the newObj array the score should be pushed to as they are separated
                // eslint-disable-next-line
                let categoriesCount = 0;
                // push first object into array, with a categore name, and an empty array for the actual score key val pairs
                let scoreObj = {};
                scoreObj.scoreCategory = scoreDescription;
                scoreObj.scores = [];
                // push the 1st object into the array
                newObj.push(scoreObj);


                // now loop through the scores
                for(let i =0; i < responseObj.candidateScores.length; i ++) {

                    // ref the iteration
                    let currentScore = responseObj.candidateScores[i];

                    // if the current description does NOT match the first description, we need another object in the array
                    if(currentScore.scoreDescription !== scoreDescription) {
                        scoreDescription = currentScore.scoreDescription;
                        categoriesCount ++;
                        let scoreObj = {};
                        scoreObj.scoreCategory = scoreDescription;
                        scoreObj.scores = [];
                        newObj.push(scoreObj);
                    }
                    // if the current description DOES match
                    if(currentScore.scoreDescription === scoreDescription) {
                        // create an empty object
                        let scoreCatObj = {};
                        // add the values to the object
                        scoreCatObj['scoreKey'] = currentScore.scoreKey;
                        scoreCatObj['scoreVal'] = currentScore.scoreValue;

                        // reference the scores array within the iterated category
                        let newObjScoresArray = newObj[categoriesCount].scores;
                        // and push the values into that array
                        newObjScoresArray.push(scoreCatObj);
                    }

                }

                // now created a tranformed object based on split above
                let videoInterviewTransform = {
                    'candidateId' : responseObj.candidateId,
                    'candidateName' : responseObj.candidateName,
                    'rating' : responseObj.rating,
                    'scoreDetails': newObj
                };


                // and commit that to the mutation
                commit('SET_SELECTED_CANDIDATE_VIDEO_DETAIL', videoInterviewTransform);

                // data is ready - commit the mutation to unset off canvas loading state.
                dispatch('unsetOffCanvasLoading');
            }).catch(() => {
                // request failed
            });

    },
    unsetSelectedCandidateVideoDetail ({commit}) {
        commit('UNSET_SELECTED_CANDIDATE_VIDEO_DETAIL');
    },
    setSelectedCandidatePredictionDetail ({commit, dispatch}, candidateId) {

        dispatch('unsetSelectedCandidatePredictionsDetail');

        return apiService.fetchPredictionDetailByCandidate(candidateId)
            .then(response => {
                commit('SET_SELECTED_CANDIDATE_PREDICTIONS_DETAIL', response.data[0]);
                dispatch('unsetOffCanvasLoading');
            }).catch(() => {
                // request failed
            });

    },
    unsetSelectedCandidatePredictionsDetail ({commit}) {
        commit('UNSET_SELECTED_CANDIDATE_PREDICTIONS_DETAIL');
    },
    fetchComplianceInformation ({commit}) {

        return apiService.fetchComplianceData()
            .then(response => {
                commit('SET_COMPLIANCE_DATA', response.data);
            }).catch(() => {
                // request failed
            });

    },
    addComplianceCandidate({commit}, applicantItem) {
        commit('SET_COMPLIANCE_CANDIDATE', applicantItem);

        // ADD TO LOCAL STATE
    },
    removeComplianceCandidate({commit}, candidateId) {


        commit('REMOVE_COMPLIANCE_CANDIDATE', candidateId);

        // REMOVE FROM LOCAL STATE

    },
    clearAllComplianceCandidates({commit}) {

        commit('CLEAR_ALL_COMPLIANCE_CANDIDATES');

    },
    deleteComplianceCandidates({commit}, candidateArray) {

        return apiService.deleteComplianceCandidates(candidateArray)
            .then(() => {

                for (let i = 0; i < candidateArray.length; i++) {

                    let currentId = candidateArray[i];
                    commit('DELETE_COMPLIANCE_CANDIDATE', currentId);
                    commit('REMOVE_COMPLIANCE_CANDIDATE', currentId);

                    // refresh this intakes at this point so when user navigates back to summaries the numbers are good
                    fetchIntakes.getIntakes();

                }

            }).catch(() => {
                // request failed
                //console.log('failed');
            });

    },
    obfuscateComplianceCandidates ({dispatch}, candidateArray) {

        return apiService.obfuscateComplianceCandidates(candidateArray)
            .then(() => {

                // after succesful obfuscation we need to refresh the data
                dispatch('fetchComplianceInformation');

            }).catch(() => {
                // request failed

                //console.log('failed');
            });
    },
    toggleComplianceDeleteConfirmation({commit}) {
        // this action calls the mutation to set the shortlist confirmation notification
        commit('SET_COMPLIANCE_CONFIRMATION');
        // and then calls again 5 seconds later which resets the value back to false
        setTimeout(() => {
            commit('SET_COMPLIANCE_CONFIRMATION');
        }, 5000)
    },
    toggleApiErrorConfirmation({commit}) {
        // this action calls the mutation to set the shortlist confirmation notification
        commit('SET_API_ERROR');
        // and then calls again 5 seconds later which resets the value back to false
        setTimeout(() => {
            commit('SET_API_ERROR');
        }, 5000)
    },
}