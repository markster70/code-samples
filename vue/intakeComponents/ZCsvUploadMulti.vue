<template>
    <div class="z-intake-upload">
        <h2 class="z-intake-error" v-if="intakeError">There was an error creating your Intake, or uploading CSV files - please check the formatting, and try again, or contact technical support</h2>
        <section class="z-intake-dropzones-wrapper">
            <header class="mb-2">
                <h2 class="z-intake-dropzones-title pb-2 text-primary">Please set intake details</h2>
                <div class="z-intake-upload-information pt-4" :class="{'has-intake-info' : hasIntakeInformation}">
                    <form @submit.prevent="hasIntakeDetail">
                        <div class="z-intake-detail-filename mb-2">
                            <div class="row">
                                <div class=" col-sm-4">
                                    <div class="form-group">
                                    <label class="z-intake-detail-filename-lbl" for="zIntakeTitle">Enter the Name for
                                        the Intake</label>
                                    <b-form-input id="zIntakeTitle" v-model="intakeTitle"
                                                  placeholder="Intake Name"></b-form-input>
                                    </div>
                                    <p class="text-danger" v-if="intakeTitleError">This Field is required</p>
                                </div>
                                <div class="col-sm-4">
                                    <ZLocationSelect :value="intakeLocation" @location-value="setIntakeLocation"
                                                     selectLabel="Choose Location of Intake"
                                                     selectId="csvUploadLocation"></ZLocationSelect>
                                    <p class="text-danger" v-if="intakeLocationError">This Field is required</p>

                                </div>
                                <div class="col-sm-4">
                                    <ZStatusSelect :value="intakeStatus" @status-value="setIntakeStatus"
                                                   selectLabel="Choose Intake Status"
                                                   selectId="csvUploadStatus"></ZStatusSelect>
                                    <p class="text-danger" v-if="intakeStatusError">This Field is required</p>
                                </div>
                            </div>
                        </div>
                        <div class="form-group d-flex justify-content-end">
                            <button class="btn btn-secondary"
                                    v-if="!this.intakeUpdateActive && !this.hasIntakeInformation">Create Intake
                            </button>
                            <button class="btn btn-secondary" v-if="this.intakeUpdateActive" @click="hasIntakeDetail">
                                Amend Intake Details Now
                            </button>
                        </div>
                    </form>
                </div>
            </header>
            <div class="z-intake-feedback-summary" v-if="hasIntakeInformation">
                <h2 class="text-primary font-weight-bold pt-3 pb-3">Intake Created</h2>
                <div class="z-intake-feedback-summary-bd d-flex align-items-center justify-content-between">
                    <h3><span class="text-info">Intake Name :</span>{{intakeTitle}}</h3>
                    <h3><span class="text-info">Intake Location :</span>{{intakeLocation}}</h3>
                    <h3><span class="text-info">Intake Status :</span>{{intakeStatus}}</h3>
                </div>
                <h4 class="pt-3">Please add CSV files to this intake below :</h4>
                <p class="small text-muted text-uppercase">Application CSV upload MUST be complete before other CSV's can be uploaded</p>
            </div>
            <div class="z-intake-dropzones-bd d-flex flex-wrap pt-4" v-if="hasIntakeInformation">

                <div class="z-intake-dropzone-outer d-flex flex-column">
                    <div ref="zIntakeDropzoneApplication" class="z-intake-dropzone" :class="{'is-uploaded' : this.applicationCsvFileUploaded}" @dragover.prevent="addDragState($event)"
                         @dragleave="removeDragState($event)">
                        <form class="d-flex flex-column justify-content-center align-items-center z-intake-dropzone-app-form"
                              enctype="multipart/form-data" novalidate @input="setApplicationFormDetail($event)">
                            <input type="file" :disabled="applicationCsvFileUploaded"  ref="applicationCsvFileInput" name="applicationCsvFileInput" accept="*csv" class="z-intake-csv-input">
                            <h2 class="z-intake-dropzone-hd mb3 text-secondary">Application Form</h2>
                            <UploadIntakeIcon class="z-intake-dropzone-icon"></UploadIntakeIcon>
                            <h3>Upload</h3>
                            <div class="z-intake-dropzone-text text-center">
                                <p class="text-secondary"><strong>Drop a CSV file, or Click</strong> here to upload
                                    your Application Form CSV.</p>
                            </div>
                            <p v-if="applicationCsvFileName">{{applicationCsvFileName}}</p>
                        </form>

                    </div>
                    <p class="alert-success p-2 d-flex align-items-center" v-if="applicationCsvFileUploaded">
                        <i class="material-icons">done</i>
                        <span class="text-uppercase small font-weight-bold">Application CSV Upload Successful</span></p>
                    <button :disabled="applicationCsvFileUploaded" class="z-intake-dropzone-btn btn btn-secondary" @click="uploadApplicationCsv">Upload Application CSV </button>
                </div>

                <div class="z-intake-dropzone-outer d-flex flex-column">
                    <div ref="zIntakeDropzonePersonality" class="z-intake-dropzone" :class="{'is-uploaded' : this.personalityCsvFileUploaded}" @dragover.prevent="addDragState($event)"
                         @dragleave="removeDragState($event)">
                        <form class="d-flex flex-column justify-content-center align-items-center" enctype="multipart/form-data" novalidate @input="setPersonalityFormDetail($event)">
                            <input :disabled="!applicationCsvFileUploaded || applicationCsvFileUploaded && personalityCsvFileUploaded" type="file" ref="personalityCsvFileInput" name="personalityCsvFileInput" accept="*csv" class="z-intake-csv-input">
                            <h2 class="z-intake-dropzone-hd mb3 text-secondary">Personality & Cognitive Traits</h2>
                            <UploadIntakeIcon class="z-intake-dropzone-icon"></UploadIntakeIcon>
                            <h3>Upload</h3>
                            <div class="z-intake-dropzone-text text-center">
                                <p class="text-secondary"><strong>Drop a CSV file, or Click</strong> here to upload
                                    your Personality & Cognitive Traits CSV.</p>
                            </div>
                            <p v-if="personalityCsvFileName">{{personalityCsvFileName}}</p>
                        </form>
                    </div>
                    <p class="alert-success p-2 d-flex align-items-center" v-if="personalityCsvFileUploaded">
                        <i class="material-icons">done</i>
                        <span class="text-uppercase small font-weight-bold">Personality CSV Upload Successful</span>
                    </p>
                    <button :disabled="!applicationCsvFileUploaded || applicationCsvFileUploaded && personalityCsvFileUploaded" @click="uploadPersonalityCsv" class="z-intake-dropzone-btn btn btn-secondary">Upload Personality & Cognitive CSV</button>
                </div>

                <div class="z-intake-dropzone-outer d-flex flex-column">
                    <div ref="zIntakeDropzoneMaths" class="z-intake-dropzone" :class="{'is-uploaded' : this.mathsCsvFileUploaded}" @dragover.prevent="addDragState($event)"
                         @dragleave="removeDragState($event)">
                        <form  class="d-flex flex-column justify-content-center align-items-center"
                              enctype="multipart/form-data" novalidate @input="setMathsFormDetail($event)">
                            <input :disabled="!applicationCsvFileUploaded || applicationCsvFileUploaded && mathsCsvFileUploaded" type="file" ref="mathsCsvFileInput" name="mathsCsvFileInput" accept="*csv" class="z-intake-csv-input">
                            <h2 class="z-intake-dropzone-hd mb3 text-secondary">Maths / Analytics Test</h2>
                            <UploadIntakeIcon class="z-intake-dropzone-icon"></UploadIntakeIcon>
                            <h3>Upload</h3>
                            <div class="z-intake-dropzone-text text-center">
                                <p class="text-secondary"><strong>Drop a CSV file, or Click</strong> here to upload
                                    your Maths / Analytics Test CSV.</p>
                            </div>
                            <p v-if="mathsCsvFileName">{{mathsCsvFileName}}</p>
                        </form>
                    </div>
                    <p class="alert-success p-2 d-flex align-items-center" v-if="mathsCsvFileUploaded">
                        <i class="material-icons">done</i>
                        <span class="text-uppercase small font-weight-bold">Maths CSV Upload Successful</span>
                    </p>
                    <button :disabled="!applicationCsvFileUploaded || applicationCsvFileUploaded && mathsCsvFileUploaded" @click="uploadMathsCsv" class="z-intake-dropzone-btn btn btn-secondary">Upload Maths / Analytics CSV</button>
                </div>

                <div class="z-intake-dropzone-outer d-flex flex-column">
                    <div ref="zIntakeDropzoneVideo" class="z-intake-dropzone" :class="{'is-uploaded' : this.VideoCsvFileUploaded}" @dragover.prevent="addDragState($event)"
                         @dragleave="removeDragState($event)">
                        <form class="d-flex flex-column justify-content-center align-items-center"
                              enctype="multipart/form-data" novalidate @input="setVideoFormDetail($event)">
                            <input :disabled="!applicationCsvFileUploaded || applicationCsvFileUploaded && VideoCsvFileUploaded" type="file" ref="VideoCsvFileInput" name="VideoCsvFileInput" accept="*csv" class="z-intake-csv-input">
                            <h2 class="z-intake-dropzone-hd mb3 text-secondary">Video Scores</h2>
                            <UploadIntakeIcon class="z-intake-dropzone-icon"></UploadIntakeIcon>
                            <h3>Upload</h3>
                            <div class="z-intake-dropzone-text text-center">
                                <p class="text-secondary"><strong>Drop a CSV file, or Click</strong> here to upload
                                    your Video Scores CSV.</p>
                            </div>
                            <p v-if="VideoCsvFileName">{{VideoCsvFileName}}</p>
                        </form>
                    </div>
                    <p class="alert-success p-2 d-flex align-items-center" v-if="VideoCsvFileUploaded">
                        <i class="material-icons">done</i>
                        <span class="text-uppercase small font-weight-bold">Video CSV Upload Successful</span>
                    </p>
                    <button :disabled="!applicationCsvFileUploaded || applicationCsvFileUploaded && VideoCsvFileUploaded" @click="uploadVideoCsv" class="z-intake-dropzone-btn btn btn-secondary">Upload Video Scores CSV</button>
                </div>

            </div>
            <div class="z-intake-dropzone-complete d-flex justify-content-end mt-3 border-top pt-3" v-if="applicationCsvFileUploaded">
                <button @click="endIntake" class="btn btn-primary text-uppercase" >Complete uploads for this intake</button>
            </div>
        </section>
    </div>
</template>

<script>

    import UploadIntakeIcon from '@/assets/icons/upload-intake.svg';
    import ZLocationSelect from '@/components/intakeComponents/ZLocationSelect';
    import ZStatusSelect from '@/components/intakeComponents/ZStatusSelect';
    import moment from 'moment';
    import apiService from '@/apiService/apiService';
    import fetchIntakes from '@/apiService/fetchIntakes';

    import {mapState} from 'vuex';
    import {mapGetters} from 'vuex';


    export default {
        name: "ZCsvUpload",
        components: {
            UploadIntakeIcon,
            ZLocationSelect,
            ZStatusSelect
        },
        mounted() {
            if (this.intakeUpdateActive) {

                // if the intakeUpdateActive is true, user is going to be updating the intake
                // so get the necessary current details via the mapped getter, getIntakeById
                // and set the detail for the fields a user is permitted to update

                let currentIntake = this.getIntakeById(this.intakeUpdateId);

                this.intakeId = currentIntake.intakeId;
                this.intakeTitle = currentIntake.intakeTitle;
                this.intakeLocation = currentIntake.intakeLocation;
                this.intakeStatus = currentIntake.intakeStatus;

            }
        },
        data() {
            return {
                // data properties for the component
                hasIntakeInformation: false,
                applicationCsvFileName: null,
                applicationCsvFileUploaded : false,
                personalityCsvFileName: null,
                personalityCsvFileUploaded : false,
                mathsCsvFileName: null,
                mathsCsvFileUploaded : false,
                VideoCsvFileName: null,
                VideoCsvFileUploaded : false,
                intakeTitle: null,
                intakeTitleError: false,
                intakeFileName: null,
                intakeLocation: null,
                intakeLocationError: false,
                intakeStatus: null,
                intakeStatusError: false,
                intakeObject: null,
                intakeDate: null,
                intakeError: false,
                intakeUploadReady: false,
                intakeId: null,
            }
        },
        methods: {
            addDragState(ev) {
                // a class is added to each upload component as a file is dragged across the component
                ev.currentTarget.classList.add('is-dragging')

            },
            removeDragState(ev) {
                // & removed as the drag ends
                ev.currentTarget.classList.remove('is-dragging');
            },
            hasIntakeDetail() {

                // this is essentially a validation function - when the form is submitted with the title, location and status fields
                // make sure they are populated

                if (this.intakeLocation === null || this.intakeStatus === null || this.intakeTitle === null || this.intakeTitle === "") {

                    // these set the value of the errors to true or false
                    this.intakeTitleError = this.intakeTitle === null || this.intakeTitle === "";
                    this.intakeLocationError = this.intakeLocation === null;
                    this.intakeStatusError = this.intakeStatus === null;

                } else if (this.intakeUpdateActive) {

                    // if the intakeUpdateActive state prop is true
                    // go to update

                    this.updateIntakeData();

                } else {
                    // or we are creating a new intake
                    this.createIntake();
                }

            },
            setApplicationFormDetail (event) {

                // set the fileName to be the name of the deposited csv file
                this.applicationCsvFileName = event.target.files[0].name;

            },
            uploadApplicationCsv() {

                // construct form object, append the csv file
                let appFormData = new FormData();

                appFormData.append('file', this.$refs.applicationCsvFileInput.files[0]);

                // upload the intake data , also passing the name of the data property to be set to true one the promise is resolved
                // note the numbers being passed here, these are what the API expects 1 : app form, 2 : maths /analytics, 3 :videoScores, 4 : personality / cognitive
                this.uploadIntakeData(1, appFormData, 'applicationCsvFileUploaded');

            },
            setPersonalityFormDetail (event) {
                // set the fileName to be the name of the deposited csv file
                this.personalityCsvFileName = event.target.files[0].name;
            },
            uploadPersonalityCsv() {

                // construct form object, append the csv file
                let appFormData = new FormData();

                appFormData.append('file', this.$refs.personalityCsvFileInput.files[0]);
                // upload the intake data , also passing the name of the data property to be set to true one the promise is resolved
                // note the numbers being passed here, these are what the API expects 1 : app form, 2 : maths /analytics, 3 :videoScores, 4 : personality / cognitive
                this.uploadIntakeData(4, appFormData, 'personalityCsvFileUploaded');

            },
            setMathsFormDetail (event) {
                this.mathsCsvFileName = event.target.files[0].name;
            },
            uploadMathsCsv() {

                let appFormData = new FormData();

                appFormData.append('file', this.$refs.mathsCsvFileInput.files[0]);
                // upload the intake data , also passing the name of the data property to be set to true one the promise is resolved
                // note the numbers being passed here, these are what the API expects 1 : app form, 2 : maths /analytics, 3 :videoScores, 4 : personality / cognitive

                this.uploadIntakeData(2, appFormData, 'mathsCsvFileUploaded');

            },
            setVideoFormDetail (event) {
                // set the fileName to be the name of the deposited csv file
                this.VideoCsvFileName = event.target.files[0].name;
            },
            uploadVideoCsv() {

                let appFormData = new FormData();

                appFormData.append('file', this.$refs.VideoCsvFileInput.files[0]);
                // upload the intake data , also passing the name of the data property to be set to true one the promise is resolved
                // note the numbers being passed here, these are what the API expects 1 : app form, 2 : maths /analytics, 3 :videoScores, 4 : personality / cognitive

                this.uploadIntakeData(3, appFormData, 'VideoCsvFileUploaded');

            },
            // helper functions for component to check location and status errors
            setIntakeLocation(locationValue) {
                this.intakeLocation = locationValue;
                this.intakeLocationError = false;
            },
            setIntakeStatus(statusValue) {
                this.intakeStatus = statusValue;
                this.intakeStatusError = false;
            },
            //reset utility function
            resetIntakeData() {

                this.intakeTitle = null;
                this.intakeFileName = null;
                this.intakeLocation = null;
                this.intakeLocationError = false;
                this.intakeStatus = null;
                this.intakeStatusError = false;
                this.intakeObject = null;
                this.intakeDate = null;
                this.applicationCsvFileName = null;
                this.applicationCsvFileUploaded = null;
                this.personalityCsvFileName = null;
                this.personalityCsvFileUploaded = null;
                this.mathsCsvFileName = null;
                this.mathsCsvFileUploaded = null;
                this.VideoCsvFileName = null;
                this.VideoCsvFileUploaded  = null;
                this.intakeError = false;



            },
            createIntake() {

                // intake creation passed to api service here
                // needs title, location, and status
                apiService.createIntake(this.intakeTitle, this.intakeLocation, this.intakeStatus)
                    .then(response => {

                        // response should have the id, and date
                        let intakeData = response.data;

                        // set those to be local data properties
                        this.intakeId = intakeData.id;
                        this.intakeDate = moment(intakeData.date).format('MMMM Do YYYY, h:mm a');


                        // call the api service again, which refreshes the intakes in state
                        fetchIntakes.getIntakes();

                        // we have the required intake information, so expose the remainder of the form
                        this.hasIntakeInformation = true;

                        // ensure there is no error status
                        this.intakeError = false;


                    })
                    .catch(() => {
                        // basic catch block for an error - displays message to customer if api fails
                        this.intakeError = true;

                    });

            },
            uploadIntakeData(stage, fileToUpload, propertyToSet ) {

                // utility function - accepts a prop variable which equals the name of the upload that is complete
                // for example applicationCsvFileUploaded - this varaible is then set to true when the promise resolves
                // and is used to indicate to user that the update has been a success
                const updateIntakeVariable = (prop) => {

                    this[prop] = true;
                };

                // call to csv upload service - requires :
                //intakeID
                // stage
                // fileToUpload ( this is set to being a formData object with the csv file appended
                apiService.uploadFilesToIntake(this.intakeId, stage, fileToUpload)
                    .then(() => {

                        // cal utility function above with argument from parent function
                        updateIntakeVariable(propertyToSet);

                        // need to fetch the intakes from the api again here to keep state in sync
                        fetchIntakes.getIntakes();
                        // reset the intakeError data item
                        this.intakeError = false;

                    })
                    .catch(() => {
                        // this handles a basic error, and show a user a message that something has gone wrong
                        this.intakeError = true;
                    });


            },
            endIntake () {
                // this dispateched action to state that sets :
                // state.applicantUploadRequired = false;
                // state.intakeUpdateActive = false;
                // see the action, and corresponding mutation
                this.$store.dispatch('endApplicantUpload');
            },
            updateIntakeData() {

                // create object with the required updates
                // to send to store action as a payload

                let updatedIntakeObj = {
                    intakeId: this.intakeId,
                    intakeTitle: this.intakeTitle,
                    intakeLocation: this.intakeLocation,
                    intakeStatus: this.intakeStatus,
                };

                // dispatch to store
                this.$store.dispatch('updateExistingIntakeData', updatedIntakeObj)
                    .then(() => {
                        // reset the intake data so that we can upload again
                        this.resetIntakeData();
                        // set the applicant upload state to false again
                        this.$store.dispatch('endApplicantUpload');

                    })
                    .catch(() => {
                        // displays basic error handling message
                        this.intakeError = true;
                    });

            }

        },
        // computed props to handle state, and retrieve the getters
        computed: {
            ...mapState({
                intakeUpdateActive: state => state.intakeUpdateActive,
                intakeUpdateId: state => state.intakeUpdateId
            }),
            ...mapGetters({getIntakeById: 'getIntakeById'})
        }
    }
</script>
