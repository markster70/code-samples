export default {
    loggedIn(state) {
        return !!state.currentUser;
    },
    applicantLength: state => {
        return state.applicantData.length;
    },
    getIntakeLocations: state => {
        return state.intakeLocations.officeLocations;
    },
    getIntakeStatuses: state => {
        return state.intakeStatuses.intakeStatusOptions;
    },
    getApplicantData: state => {
        return state.applicantData;
    },
    getIntakeById: state => id => {
        return state.applicantData.find(applicantData => applicantData.intakeId === id)
    },
    getApplicantById: state => id => {
        return state.selectedApplicants.find(selectedApplicants => selectedApplicants.candidateId === id);
    },
    isUploadRequired: state => {
        return state.applicantUploadRequired;
    },
    getOffCanvasState: state => {
        return state.offCanvas;
    },
    getDetailFilterStates: state => (key) => {
        return state.detailTableFilters[key];
    },
    getCurrentIntake: state => {
        return state.currentIntake.intakeItems;
    }
}