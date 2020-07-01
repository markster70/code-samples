<template>
    <section ref="zIntakeSummary" class="z-intake-summary" :class="{ 'is-hover-active': hoverActive }">
        <header class="d-flex">
            <div class="z-intake-hd">
            <h2 class="z-intake-summary-title text-secondary font-weight-bold">{{intakeSummary.intakeTitle}}</h2>
            <h3 class="z-intake-summary-location text-light">{{intakeSummary.intakeLocation}}</h3>
            </div>
            <div class="z-intake-status d-flex">
                <div class="z-intake-status-latest">
                    <h4 class="z-intake-status-title font-weight-bold text-secondary">Latest Update</h4>
                    <time class="z-intake-status-time text-light">{{this.intakeDate}}</time>
                </div>
                <div class="z-intake-status-description text-right d-flex align-items-center">
                    <p class="text-info font-weight-bold d-flex align-items-center mb-0">
                        <i class="material-icons is-info is-solid mr-0">access_time</i>
                        {{intakeSummary.intakeStatus}}
                    </p>
                    <b-dropdown id="z-intake-summary-actions-menu" text="actions" class="z-intake-summary-dd ml-4" right>
                        <b-dropdown-item-button  @click="commenceIntakeUpload(intakeSummary.intakeId)">
                            <span class="d-inline-block mr-3">Update</span>
                            <i class="material-icons is-plain is-med-icon mr-0">refresh</i>
                        </b-dropdown-item-button>
                        <b-dropdown-item-button @click="deleteIntake(intakeSummary.intakeId)">
                            <span class="d-inline-block mr-3">Delete</span>
                            <i class="material-icons is-plain is-med-icon mr-0">close</i>
                        </b-dropdown-item-button>
                    </b-dropdown>
                </div>
            </div>
        </header>
        <div class="z-intake-bar-wrapper mt-4" @mouseover="hoverActive = true" @mouseleave="hoverActive = false">
            <router-link ref="zIntakeLink"  class="z-intake-bar-link" :to="{name : 'applicant-detail', params : {id : intakeSummary.intakeId, clearSelected : true}}">
                <div class="z-intake-bar d-flex">
                    <div class="z-intake-bar-applicant-count-wrap">
                        <span class="z-intake-bar-applicant-count"></span>
                        <span class="z-intake-bar-stage-label text-secondary ml-auto mt-3">Applicants : <strong>{{intakeSummary.intakeItems}}</strong></span>
                    </div>
                    <div class="z-intake-bar-stage-wrap d-flex flex-wrap">
                        <span class="z-intake-bar-stage z-intake-bar-stage-4"></span>
                        <span class="z-intake-bar-stage-label text-secondary ml-auto mt-2 font-weight-bold">Stage 4</span>
                    </div>
                </div>
            </router-link>
        </div>
    </section>
</template>

<script>

    import moment from 'moment';

    export default {
        name: "ZIntakeSummary",
        props : {
            intakeSummary : {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                hoverActive: false,
            };
        },
        methods: {
            deleteIntake(intakeIdentifier) {
                this.$store.dispatch('deleteSelectedIntake', intakeIdentifier);
            },
            commenceIntakeUpload (intakeIdentifier) {
                this.$store.dispatch('startApplicantUpload', intakeIdentifier);
            }
        },
        computed : {
            intakeDate () {

                // date arrives in a date string from the api so formatting using moment here
                let formattedDate = moment(this.intakeSummary.intakeDate).format('MMMM Do YYYY, h:mm a');

                return formattedDate;
            }
        }

    }
</script>
