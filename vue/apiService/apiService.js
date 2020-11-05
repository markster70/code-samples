import axios from 'axios';

// this is the base url for all addresses - should be used for ensuring that the app is connected to the api
const baseUrlAddress = 'https://localhost:5001/api';

// may be possible to refactor these 3 calls if the headers were determined, or could just go with a blank set of headers for all

// basic request for gets to fetch json data
const apiClient = axios.create({
    baseURL: baseUrlAddress,
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }

});

// used this for posting back formData object, for uploadiing CSV's - notice the content type
const postApiClientFormData = axios.create({
    baseURL: baseUrlAddress,
    withCredentials: false,
    // not sure if we need to set headers here, I need to check this with Lorenzo
    headers: {
        'Content-Type': 'multipart/form-data'
    }

});


// used this for posts / deletes etc where no headers to be supplied for deletes etc
const postApiClient = axios.create({
    baseURL: baseUrlAddress,
    withCredentials: false,
    // not sure if we need to set headers here, I need to check this with Lorenzo
    headers: {}

});

export default {
    fetchIntakes() {
        // general fetch of intakes
        return apiClient.get('/intakes/');
    },
    fetchIntakeById(intakeId) {
        // fetch an intake by id
        return apiClient.get('/intakes/getbyid?id=' + intakeId);
    },
    // next functions are used to pull the candidate drill down information on request from the app
    fetchPersonalityDetailByCandidate(candidateId) {
        return apiClient.get('/applicantinsights/PersonalityDetails?candidateId=' + candidateId);
    },
    fetchMathsDetailByCandidate(candidateId) {
        return apiClient.get('/applicantinsights/MathsDetails?candidateId=' + candidateId);
    },
    fetchVideoDetailByCandidate(candidateId) {
        return apiClient.get('/applicantinsights/VideoDetails?candidateId=' + candidateId);
    },
    fetchPredictionDetailByCandidate(candidateId) {
        return apiClient.get('/applicantinsights/PredictionDetail?candidateId=' + candidateId);
    },
    fetchComplianceData() {
        // this fetches all clients from the compliance API
        return apiClient.get('/compliance')
    },

    // posts to the api here, for creating / updating, and removing intakes

    createIntake(intakeName, intakeLocation, intakeStatus) {
        return apiClient.post('/intakes/CreateIntake?name=' + intakeName + '&location=' + intakeLocation + '&status=' + intakeStatus);
    },
    uploadFilesToIntake(intakeId, intakeStage, formData) {
        return postApiClientFormData.post('/intakes/UploadFile?intakeId=' + intakeId + '&stage=' + intakeStage, formData);
    },
    deleteIntake(intakeId) {
        return postApiClient.delete('/intakes/Delete?intakeId=' + intakeId);
    },
    updateIntake(intakeId, name, location, status) {
        return postApiClient.put('/intakes/UpdateIntake?intakeId=' + intakeId + '&name=' + name + '&location=' + location + '&status=' + status);
    },
    // shortlisting function - cna be used to add and remove with an array of candidate id's
    manageApplicantShortListing(shortListValue, candidateIdArray) {

        // need to construct an api call here as the  end point will accept multiple candidates to add / remove from shortlist
        // the action in vuex receives an array of id's to add remove, so we'll loop through, and generate the right string

        let shortlistUrl = '/applicantinsights/Shortlist?shortlisted=' + shortListValue + '&candidateIds=';

        for (let i = 0; i < candidateIdArray.length; i++) {

            if (i < 1) {

                shortlistUrl += candidateIdArray[i];
            } else {
                shortlistUrl += '&candidateIds=' + candidateIdArray[i];
            }
        }

        // when that is done, we simply call the api client, with the url string,and shortlisting is managed

        return postApiClient.post(shortlistUrl);
    },
    // removing candidates via compliance ui
    deleteComplianceCandidates(candidateIdArray) {


        let complianceDeleteUrl = '/Compliance/Delete?candidateIds=';

        for (let i = 0; i < candidateIdArray.length; i++) {

            if (i < 1) {

                complianceDeleteUrl += candidateIdArray[i];
            } else {
                complianceDeleteUrl += '&candidateIds=' + candidateIdArray[i];
            }
        }


        return postApiClient.delete(complianceDeleteUrl);
    },
    // obfuscation
    obfuscateComplianceCandidates(candidateIdArray) {

        let complianceObfuscateUrl = '/Compliance/Obfuscate?candidateIds=';

        for (let i = 0; i < candidateIdArray.length; i++) {

            if (i < 1) {

                complianceObfuscateUrl += candidateIdArray[i];
            } else {
                complianceObfuscateUrl += '&candidateIds=' + candidateIdArray[i];
            }
        }

        return postApiClient.post(complianceObfuscateUrl);
    },
}


// Below is map of current api endpoints for reference - This will no doubt need an update as time goes, or preferably, storing somewhere else
// when api is settled may not need this as the functions in this files should be calling the right endpoints anyway

// /Intakes


//
// POST CreateIntake (string name, string location, string status)
// PUT UpdateIntake (Guid intakeId, string name, string location, string status)
// GET – returns all intakes.
//     GET GetById (Guid id)
// POST UploadFile (Guid intakeId, int stage, IFormFile file)
// DELETE Delete (Guid intakeId)
// POST ResetDatabase()
//


// /ApplicationInsights
//
//
//
// GET PersonalityDetails (Guid candidateId)
// GET MathsDetails (Guid candidateId)
// GET VideoInterviewDetails (Guid candidateId)
// GET ApplicationFormDetails(Guid candidateId)
// GET PredictionDetail(Guid candidateId)
// POST Shortlist (IEnumerable<Guid> candidateIds, bool shortlisted)
//


// /Compliance
//
// Delete (IEnumerbale<Guid> candidateIds)
// Obfuscate(IEnumerable<Guid> candidateIds)
//

