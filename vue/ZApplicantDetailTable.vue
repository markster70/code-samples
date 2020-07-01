<template>
    <div class="z-applicant-table-wrapper">
        <nav class="z-applicant-table-nav" aria-label="Secondary Navigation">
            <div class="z-applicant-table-inner">
                <b-button ref="zTableInsightsBtn" class="is-current" variant="link" @click="setFields(fieldsA, $event)">
                    Applicant Insights
                </b-button>
                <b-button ref="zTablePredictionsBtn" variant="link" @click="setFields(fieldsB, $event)">Predictions
                </b-button>
                <b-button v-if="activeShortList && activeShortList > 0" @click="showShortListView($event)" ref="zTableShortListBtn" variant="link">Short-Listed Candidates<span class="pl-2">({{activeShortList}})</span></b-button>
            </div>
        </nav>
        <div class="z-intake-table">
            <div class="z-intake-table-filter-toggle-wrapper">
                <button class="btn btn-link d-flex align-items-center z-intake-table-filter-toggle"
                        @click="filtersVisible = !filtersVisible">
                    <i class="material-icons is-large-icon">filter_list</i>
                    <span class="text-secondary font-weight-bold" v-show="!filtersVisible">Filters</span>
                    <span class="text-secondary font-weight-bold" v-show="filtersVisible">Hide Filters</span>
                </button>
            </div>
            <button v-if="emptyFilters" class="btn btn-link z-clear-filters-link mt-2 mr-1" @click="clearAllFilters">
                Reset All Filters
            </button>
            <b-table ref="applicantTable"
                     responsive
                     sort-icon-right
                     v-model="visibleRows"
                     :currentPage="currentPage"
                     id="z-applicant-intake-table"
                     @sort-changed="updateClustersKey"
                     :items="filteredItems"
                     :fields="currentFields"
                     :perPage="rowsPerPage"
                     :tbody-tr-class="rowSelectedClass"
                     :sort-by.sync="sortBy"
                     :thead-class="theadClass"
                     primary-key="id">
                <template v-if="filtersVisible" v-slot:thead-top="data">
                    <b-tr class="z-intake-table-th" v-if="currentFieldChoice.fieldsA">
                        <b-th class="z-intake-table-th-filter-first">
                            <ZApplicantTableSelectedFilter
                                    :eventToEmit="'selectedEmit'"
                                    :filterId="'appTableSelectedFilter'"
                                    :labelVal="'Selected'"
                                    :value="filtersValues.selected"
                                    @selectedEmit="updateSelectedFilters">
                            </ZApplicantTableSelectedFilter>
                        </b-th>
                        <b-th class="z-intake-table-th-filter-name">
                            <ZApplicantPeopleSearch
                                    v-model="filtersValues.candidateName">
                            </ZApplicantPeopleSearch>
                        </b-th>
                        <b-th>
                            <ZApplicantTableScoreFilter
                                    :options="appConstantValues.APP_SCORE_FILTER_OPTIONS"
                                    :eventToEmit="'appScoreEmit'"
                                    :filterId="'appTableAppScoreFilter'"
                                    :labelVal="'Application'"
                                    :value="filtersValues.applicationScore"
                                    @appScoreEmit="updateAppScoreFilters">
                            </ZApplicantTableScoreFilter>
                        </b-th>
                        <b-th>
                            <ZApplicantTableValueFilter
                                    :options="appConstantValues.PERSONALITY_FILTER_OPTIONS"
                                    :eventToEmit="'personalityTestEmit'"
                                    :filterId="'appTablePersonalityFilter'"
                                    :labelVal="'Personality'"
                                    :value="filtersValues.personalityTest"
                                    @personalityTestEmit="updatePersonalityFilters">
                            </ZApplicantTableValueFilter>
                        </b-th>
                        <b-th>
                            <ZApplicantTableScoreFilter
                                    :options="appConstantValues.MATHS_TEST_FILTER_OPTIONS"
                                    :eventToEmit="'mathsTestEmit'"
                                    :filterId="'appTableMathsTestFilter'"
                                    :labelVal="'Maths'"
                                    :value="filtersValues.mathsTest"
                                    @mathsTestEmit="updateMathsTestFilters">
                            </ZApplicantTableScoreFilter>
                        </b-th>
                        <b-th>
                            <ZApplicantTableScoreFilter
                                    :options="appConstantValues.VIDEO_INTERVIEW_FILTER_OPTIONS"
                                    :eventToEmit="'videoScoreEmit'"
                                    :filterId="'appTableVidScoreFilter'"
                                    :labelVal="'Video'"
                                    :value="filtersValues.videoInterview"
                                    @videoScoreEmit="updateVideoScoreFilters">
                            </ZApplicantTableScoreFilter>
                        </b-th>
                    </b-tr>
                    <b-tr class="z-intake-table-th" v-if="currentFieldChoice.fieldsB">
                        <b-th class="z-intake-table-th-filter-first">
                            <ZApplicantTableSelectedFilter
                                    :eventToEmit="'selectedEmit'"
                                    :filterId="'appTableSelected'"
                                    :labelVal="'Selected'"
                                    :value="filtersValues.selected"
                                    @selectedEmit="updateSelectedFilters">
                            </ZApplicantTableSelectedFilter>
                        </b-th>
                        <b-th class="z-intake-table-th-filter-name">
                            <ZApplicantPeopleSearch v-model="filtersValues.candidateName"></ZApplicantPeopleSearch>
                        </b-th>
                        <b-th>
                            <ZApplicantTableValueFilter
                                    :options="appConstantValues.PL_AFTER_REBATES_FILTER_OPTIONS"
                                    :eventToEmit="'plRebatesScoreEmit'"
                                    :filterId="'plRebatesScoreFilter'"
                                    :labelVal="'PL After Rebates'"
                                    :value="filtersValues.plAfterRebates"
                                    @plRebatesScoreEmit="updatePlAfterRebatesFilters">
                            </ZApplicantTableValueFilter>
                        </b-th>
                        <b-th>
                            <ZApplicantTableValueFilter
                                    :options="appConstantValues.OSTC_CONTRIBUTION_FILTER_OPTIONS"
                                    :eventToEmit="'ostcContributionScoreEmit'"
                                    :filterId="'ostcContributionFilter'"
                                    :labelVal="'OSTC Contribution'"
                                    :value="filtersValues.ostcContribution"
                                    @ostcContributionScoreEmit="updateOsctContributionFilters">
                            </ZApplicantTableValueFilter>
                        </b-th>
                        <b-th>
                            <ZApplicantTableValueFilter
                                    :options="appConstantValues.BONUS_FILTER_OPTIONS"
                                    :eventToEmit="'bonusDetailEmit'"
                                    :filterId="'bonusDetailFilter'"
                                    :labelVal="'Bonus'"
                                    :value="filtersValues.bonus"
                                    @bonusDetailEmit="updateBonusFilters">
                            </ZApplicantTableValueFilter>
                        </b-th>
                        <b-th>
                            <ZApplicantTableValueFilter
                                    :options="appConstantValues.HARD_STOP_FILTER_OPTIONS"
                                    :eventToEmit="'hardStopEmit'"
                                    :filterId="'hardStopLimitFilter'"
                                    :labelVal="'Hard Stop Limit'"
                                    :value="filtersValues.hardStop"
                                    @hardStopEmit="updateHardStopFilters">
                            </ZApplicantTableValueFilter>
                        </b-th>
                        <b-th>
                            <ZApplicantTableValueFilter
                                    :options="appConstantValues.CLUSTER_FILTER_OPTIONS"
                                    :eventToEmit="'clusterFilterEmit'"
                                    :filterId="'clusterFilter'"
                                    :labelVal="'Likely Cluster'"
                                    :value="filtersValues.maxCluster"
                                    @clusterFilterEmit="updateClusterFilters">
                            </ZApplicantTableValueFilter>
                        </b-th>
                    </b-tr>
                </template>
                <template v-slot:head(selected)="data">
                    <b-button size="sm" variant="link" @click="clearAllSelected">Clear All</b-button>
                </template>
                <template v-slot:head(cluster)="data">
                    <div class="z-cluster-hd-wrap d-flex align-items-center">
                    <span>{{data.label}}</span>
                    <button @click="showClusterInfo" class="z-cluster-info-trigger ml-auto btn btn-link">
                        <i class="material-icons is-std-icon">info</i>
                        <span class="sr-only">See cluster category information</span>
                    </button>
                    </div>
                </template>
                <template v-slot:cell(selected)="{ item }">
                    <b-checkbox v-model="item.selected" @change="rowClicked(item)"></b-checkbox>
                </template>
                <template v-slot:cell(applicationScore)="data">
                    <span>{{data.value}}</span>
                </template>
                <template v-slot:cell(personalityTest)="data">
                    <button v-if="data.value" class="btn z-plain-btn" @click="personalityTestDetail(data.value, data.item)">
                        <ZApplicantDone :done="data.item.personalityTest"></ZApplicantDone>
                    </button>
                    <span v-else>
                         <ZApplicantDone :done="data.item.personalityTest"></ZApplicantDone>
                    </span>
                </template>
                <template v-slot:cell(mathsTest)="data">
                    <button v-if="data.value > 0" class="btn z-plain-btn" @click="mathsTestDetail(data.value, data.item)">
                    <span>{{data.value}}</span>
                    </button>
                    <span v-else>
                        {{data.value}}
                    </span>
                </template>
                <template v-slot:cell(videoInterview)="data">
                    <button v-if="data.value > 0" class="btn z-plain-btn" @click="videoInterviewDetail(data.value, data.item)">
                        <span>{{data.value}}</span>
                    </button>
                    <span v-else>
                        {{data.value}}
                    </span>
                </template>
                <template v-slot:cell(plAfterRebates)="data">
                    <span v-if="data.value.length < 1">{{predictionDataUnavailableMessage}}</span>
                    <button v-else class="btn z-plain-btn" @click="plAfterRebatesDetail(data.value, data.item)">
                        <ZApplicantPlRange :range="data.value"></ZApplicantPlRange>
                    </button>
                </template>
                <template v-slot:cell(ostcContribution)="data">
                    <span v-if="data.value.length < 1">{{predictionDataUnavailableMessage}}</span>
                    <button v-else class="btn z-plain-btn" @click="ostcContributionDetail(data.value, data.item)">
                        <ZApplicantOstcContribution :range="data.value"></ZApplicantOstcContribution>
                    </button>
                </template>
                <template v-slot:cell(bonus)="data">
                    <span v-if="data.value.length < 1">{{predictionDataUnavailableMessage}}</span>
                    <button v-else class="btn z-plain-btn" @click="bonusDetail(data.value, data.item)">
                        <ZApplicantBonusRange :range="data.value"></ZApplicantBonusRange>
                    </button>
                </template>
                <template v-slot:cell(hardstop)="data">
                    <span v-if="data.value.length < 1">{{predictionDataUnavailableMessage}}</span>
                    <button v-else class="btn z-plain-btn" @click="hardStopDetail(data.value, data.item)">
                        <ZApplicantHardStopLimit :range="data.value"></ZApplicantHardStopLimit>
                    </button>
                </template>
                <template v-slot:cell(cluster)="data">
                    <span v-if="data.item.clusterA === 0 && data.item.clusterB === 0 && data.item.clusterC === 0">{{predictionDataUnavailableMessage}}</span>
                    <button v-else class="btn z-plain-btn" @click="clusterDetail(data.value, data.item)">
                        <ZApplicantClusters :key="clustersKey" @clusterDetail="addClusterToItem" :clusters="[data.item.clusterA,data.item.clusterB, data.item.clusterC] "></ZApplicantClusters>
                    </button>
                </template>
            </b-table>

            <div class="z-intake-table-pagination">
                <div class="d-flex flex-fill align-items-center ml-2 mr-2">
                    <div class="z-intake-table-page-count d-flex align-items-center w-75">
                        <p class="text-secondary mb-0 w-auto mr-3">Displaying {{visibleRows.length}} of
                            {{totalTableRows}} rows </p>
                        <div class="z-intake-table-pagination-row-sel mb-0 flex-fill">
                            <span>Rows Per Page</span>
                            <b-form-select v-model="rowsPerPage" class="d-inline w-auto ml-1">
                                <option :value="15">15</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="20">25</option>
                            </b-form-select>
                            <button class="btn btn-link ml-5" @click="resetSort">Reset Sorting</button>
                        </div>
                    </div>
                    <div class="z-intake-pagination-wrap ml-auto">
                        <b-pagination
                                v-model="currentPage"
                                :total-rows="totalTableRows"
                                :per-page="rowsPerPage"
                                @change="updateClustersKey"
                                aria-controls="z-applicant-intake-table">
                        </b-pagination>

                    </div>

                </div>
            </div> <!-- end pagination -->
        </div><!-- end table structure-->
    </div><!-- end table outer wrapper -->
</template>

<script>

    // component dependencies for table

    import ZApplicantDone from '@/components/commonComponents/ZApplicantDone';
    import ZApplicantPeopleSearch from '@/components/detailTableControls/ZApplicantPeopleSearch';
    import ZApplicantTableValueFilter from '@/components/detailTableControls/ZApplicantTableValueFilter';
    import ZApplicantTableScoreFilter from '@/components/detailTableControls/ZApplicantTableScoreFilter';
    import ZApplicantTableSelectedFilter from '@/components/detailTableControls/ZApplicantTableSelectedFilter';
    import ZApplicantPlRange from '@/components/detailTableControls/ZApplicantPlRange';
    import ZApplicantOstcContribution from '@/components/detailTableControls/ZApplicantOstcContribution';
    import ZApplicantBonusRange from '@/components/detailTableControls/ZApplicantBonusRange';
    import ZApplicantHardStopLimit from '@/components/detailTableControls/ZApplicantHardStopLimit';
    import ZApplicantClusters from '@/components/detailTableControls/ZApplicantClusters';

    import ZDetailTableFilters from '@/filterServices/zDetailTableFilters';
    import ZClearDetailTableSelected from '@/commonFunctions/ZClearDetailTableSelected';
    import ZOffCanvasFunctions from '@/offCanvasServices/ZOffCanvasFunctions';

    import appConstants from '@/appConstants/commonAppContent';

    import {mapState} from 'vuex';

    export default {
        name: "ZApplicantDetailTable",
        // note filter functions are imported as mixin to keep component file size manageable
        mixins: [ZDetailTableFilters, ZClearDetailTableSelected, ZOffCanvasFunctions],
        props: {
            tableData: {
                // date for the table is passed via this prop currently
                required: true
            },
            intakeId: {
                required: true
            },
            clearSelected: {
                required: false,
                type: Boolean
            }
        },
        components: {
            ZApplicantDone,
            ZApplicantPeopleSearch,
            ZApplicantTableScoreFilter,
            ZApplicantTableValueFilter,
            ZApplicantTableSelectedFilter,
            ZApplicantPlRange,
            ZApplicantOstcContribution,
            ZApplicantBonusRange,
            ZApplicantHardStopLimit,
            ZApplicantClusters
        },
        created() {
            // as the fields for the table can be switched via buttons, on creation, we set the fields to be the default
            // the fields determine the keys for the bs-vue table component
            this.setFields(this.fieldsA);
            this.$store.dispatch('resetAllDetailFilters');

            if (this.clearSelected) {
                this.clearAllSelected();
            }

        },
        mounted() {
            // get the total item for the table and assign to data to be used in the table footer
            this.totalItems = this.items.length;
            // clearing the filters upon mount to ensure that a full set of data is available
            this.clearAllFilters();

            this.injectFieldLabels();

            // this calls the function that adds the maxCluster to each item
            this.addClusterToItem(this.tableData);

        },
        data() {
            return {
                // these fields set up the bs-vue table the key is the key in the data, set a boolean for whether sorting is required, and add a custom label if needs be
                fieldsA: [
                    {key: 'selected', sortable: false},
                    {key: 'candidateName', sortable: true, label : appConstants.DETAIL_TABLE_HEADER_LABELS.CandidateHeader},
                    {key: 'applicationScore', sortable: true, label: appConstants.DETAIL_TABLE_HEADER_LABELS.ApplicationFormHeader},
                    {key: 'personalityTest', sortable: true, label: appConstants.DETAIL_TABLE_HEADER_LABELS.PersonalityHeader},
                    {key: 'mathsTest', sortable: true, label: appConstants.DETAIL_TABLE_HEADER_LABELS.MathsHeader},
                    {key: 'videoInterview', sortable: true, label: appConstants.DETAIL_TABLE_HEADER_LABELS.VideoHeader},
                ],
                fieldsB: [
                    {key: 'selected', sortable: false},
                    {key: 'candidateName', sortable: true, label : appConstants.DETAIL_TABLE_HEADER_LABELS.CandidateHeader},
                    {key: 'plAfterRebates', sortable: true, label : appConstants.DETAIL_TABLE_HEADER_LABELS.PlHeader},
                    {key: 'ostcContribution', sortable: true, label: appConstants.DETAIL_TABLE_HEADER_LABELS.OstcContributionHeader},
                    {key: 'bonus', sortable: true, label : appConstants.DETAIL_TABLE_HEADER_LABELS.BonusHeader},
                    {key: 'hardstop', sortable: true, label : appConstants.DETAIL_TABLE_HEADER_LABELS.HardStopHeader},
                    {key: 'cluster', sortable: false, label : appConstants.DETAIL_TABLE_HEADER_LABELS.ClusterHeader},

                ],
                // the bs-vue table uses items as the data set, so this.tableData prop is how data is passed just now
                items: this.tableData,
                // per page value, available to modify in  table footer
                rowsPerPage: 15,
                // currentFields is used to switch the fields between set A & set B
                currentFields: null,
                // this object is used to enable per fields custom head slots in thr table
                currentFieldChoice: {
                    fieldsA: true,
                    fieldsB: false
                },
                // current page - set to 1 on init
                currentPage: 1,
                // totalItems set as the table is created
                totalItems: null,
                // the bs-vue table pushes the visible rows into this array - useful for counting the nr of rows per page
                visibleRows: [],
                // boolean for v-if use - if this value is true, we expose a hide filters and reset filters btn
                filtersVisible: false,
                // this is used by the sort reset button in the footer
                sortBy: null,
                // obj to hold the filter values as they are set by th user - obj is then use for comparion with data values and resetting etc
                filtersValues: {
                    selected: false,
                    candidateName: null,
                    applicationScore: null,
                    personalityTest: null,
                    mathsTest: null,
                    videoInterview: null,
                    assessmentCentre: null,
                    plAfterRebates: null,
                    ostcContribution: null,
                    bonus: null,
                    hardstop: null,
                    maxCluster: null

                },
                filtersComparisionValues: {
                    comparisionFilterDefault: '===',
                    applicationScore_comparison: this.comparisionFilterDefault,
                    mathsTest_comparision: this.comparisionFilterDefault,
                    videoInterview_comparison: this.comparisionFilterDefault,
                    assessmentCentre_comparison: this.comparisionFilterDefault,
                    plAfterRebates_comparision: this.comparisionFilterDefault,
                    ostcContribution_comparision: this.comparisionFilterDefault,
                    bonus_comparision: this.comparisionFilterDefault,
                    hardstop_comparison: this.comparisionFilterDefault,
                    maxCluster_comparison: this.comparisionFilterDefault

                },
                appConstantValues: appConstants,
                theadClass: 'z-intake-table-thead',
                showShortList: false,
                clustersKey : 0,
                predictionDataUnavailableMessage: 'No Data Available'
            }
        },
        // component functions
        methods: {
            injectFieldLabels() {

                // bs-vue doesnt have the facility to inject the labels row of into the tbody, so I'm doing dynamically here
                // the values for the labels will come in via api shortly

                // function is called via mounted lifecycle hook and also via watch on the currentFields item

                const dataTableBody = this.$el.querySelector('tbody');

                // set the content of the labels in template literals
                const filterLabelsA = `<td></td><td>Rate</td><td>Out of 3</td><td></td><td>In %</td><td>Out of 3</td>`;
                // const filterLabelsB = `<td></td><td>Confidence level</td><td>55%</td><td>25%</td><td>35%</td><td>3%<td>70%</td>`;

                // check to see if the element already exists, if it does strip it out, and re-inject

                if (this.$el.querySelector('.z-intake-table-label-wrapper')) {
                    // using a spread operator here to get the existing tr element, and remove it from the dom if it already exists
                    [...document.getElementsByClassName('z-intake-table-label-wrapper')].map(el => el.remove());
                }

                // now we are clear to add the element, and based on the current fields, we can add in the right labels


                if (this.currentFieldChoice.fieldsA) {
                    const filterLabelWrapper = document.createElement('tr');
                    filterLabelWrapper.setAttribute('class', 'z-intake-table-label-wrapper');
                    filterLabelWrapper.innerHTML = filterLabelsA;
                    dataTableBody.prepend(filterLabelWrapper);
                }


            },
            setFields(fieldChoice, event) {
                // function set the fields of the table - enables switching between insights and predictions

                // call function which sets the showShortlist to false as the field are switched between fieldsA & B
                this.hideShortListView();

                this.currentFields = fieldChoice;


                if (fieldChoice === this.fieldsA) {
                    this.currentFieldChoice.fieldsA = true;
                    this.currentFieldChoice.fieldsB = false;
                } else {
                    this.currentFieldChoice.fieldsA = false;
                    this.currentFieldChoice.fieldsB = true;
                }

                if(event) {
                    this.toggleTableTabStates(event);
                }

                // the clusters component needs a force refresh so iterate the key as the fields change
                this.updateClustersKey();

            },
            toggleTableTabStates(event) {

                // function handles the classes for the 'tab' type buttons as a user clicks

                this.$refs.zTableInsightsBtn.classList.remove('is-current');
                this.$refs.zTablePredictionsBtn.classList.remove('is-current');

                if(this.$refs.zTableShortListBtn) {
                    this.$refs.zTableShortListBtn.classList.remove('is-current');
                }

                event.target.classList.add('is-current');
            },
            tbodyRowClass(item) {
                // if the row has the selected value set, we add a class to it to indicate selected
                if (item.selected) {
                    return ["b-table-row-selected", "cursor-pointer"]
                } else {
                    return ["cursor-pointer"]
                }
            },
            rowClicked(item) {
                // this deals with the clicks of the checkboxes for row selection
                // it also dispatches the item details to the app state in vuex
                // or removes the selection from state
                if (item.selected) {
                    this.$set(item, 'selected', false);
                    this.$store.dispatch('removeSelectedApplicant', item.candidateId);
                } else {

                    this.triggerOffCanvas('Selected Candidates','ManageCandidatesShortList');
                    this.$set(item, 'selected', true);
                    this.$store.dispatch('addSelectedApplicant', item);
                }
            },
            clearAllSelected() {

                // note - function called from common mixin imported into the is component - see common functions
                // coded like this as clearing rows for table now used via off canvas panels as well as in this component
                this.clearSelectedTableRows(this.items);
            },
            rowSelectedClass(item) {
                if(item.shortListed) {
                    return 'table-row-shortlisted'
                }
            },
            // reset sort
            resetSort() {
                this.sortBy = 'none';
            },
            showClusterInfo () {
                this.triggerOffCanvas('Clusters Details','ClusterInformation');
            },
            addClusterToItem(dataItems) {

                // this function goes through the data items, and sets up the maxCluster val for each item
                // im not convinced this is the best place to carry out this operation
                // server side might be better

                for (let i = 0; i < dataItems.length; i++) {

                    let comparisonArray = [];
                    let intakeItem = dataItems[i];


                    comparisonArray.push(intakeItem.clusterA, intakeItem.clusterB, intakeItem.clusterC);

                    let largestVal = 0;
                    let maxCluster = null;

                    comparisonArray.forEach((arrayItem, index) => {

                        if (arrayItem  > largestVal) {
                            largestVal = arrayItem;
                            maxCluster = index + 1;
                        }
                    });

                    this.$set(intakeItem, 'maxCluster', maxCluster);

                }

            },
            showShortListView (event) {
                // function filters by shortlisted candidates, and also provide
                this.showShortList = true;
                this.$store.dispatch('manageShortListView', true);
                this.toggleTableTabStates(event);
            },
            hideShortListView() {
                // make sure the shortlist is not being shown at this point
                this.showShortList = false;
                this.$store.dispatch('manageShortListView', false);
            },
            updateClustersKey () {
                // this function iterates the clusters key which is used to force the cluster component
                // to re-render - wait for the dom to be fully updated via nextTick, and iterate the counter
                // which is applied as the :key to the ZApplicantClusters component
                // ZApplicantClusters is doing some client side sorting / array work which causes vue's reactivity to
                // not apply for filtering and pagination on this table.
                this.$nextTick(() => {
                    this.clustersKey++;
                });
            }

        },
        computed: {
            // total table rows is used in the footeer for the application
            totalTableRows() {
                return this.filteredItems.length;
            },
            emptyFilters() {
                // looping through the filtersValues obj here to see if any filters are active - if so we cna activate the reset filters button
                let hasFilters = false;

                let filterValues = Object.values(this.filtersValues);

                for (const val of filterValues) {
                    if (val != null) {
                        hasFilters = true;

                    }
                }
                return hasFilters;

            },
            // this is where the filtering of items is taking place in the table - items for the table is bound to this computed property, and changes dynamically as the filters are
            // set and unset
            // functions that are passed to filter are imported as mixin to this component
            filteredItems() {
                return this.items
                    .filter(this.filterBySelected)
                    .filter(this.filterByName)
                    .filter(this.filterByAppScore)
                    .filter(this.filterByMathsTest)
                    .filter(this.filterByVideoScore)
                    .filter(this.filterByAssessmentScore)
                    .filter(this.filterByPersonalityTest)
                    .filter(this.filterByPlRebates)
                    .filter(this.filterByOstcContribution)
                    .filter(this.filterByBonus)
                    .filter(this.filterByHardStopLimit)
                    .filter(this.filterByCluster)
                    .filter(this.filterByShortList)

            },
            ...mapState({selectedApplicants : 'selectedApplicants', activeShortList: state => state.currentIntake.hasShortList})
        },
        watch: {
            currentFields: function () {
                this.injectFieldLabels();
            },
            filteredItems : function () {
                this.updateClustersKey();
            }
        }
    }
</script>

<style>

</style>