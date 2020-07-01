<template>
    <div class="z-location-select">
        <div class="form-group">
            <label v-if="selectLabel" class="mb-1" :for="selectId">{{selectLabel}}</label>
            <b-form-select @input="emitValue" :value="value" :id="selectId" :options="options">
                <template v-slot:first>
                    <option :value="null" disabled>Please select</option>
                </template>
            </b-form-select>
        </div>
    </div>
    
</template>

<script>

    export default {
        name: "ZStatusSelect",
        data () {
            return {
                options: [],
            }
        },
        props : {
            selectId : String,
            selectLabel : String,
            value: String
        },
        created() {

            // fetch locations from store using the getters helpers

            let statuses = this.$store.getters.getIntakeStatuses;
            // loop through and apply to select value / text / pairs
             for(let i =0; i < statuses.length; i++) {
                 // create an empty object to add to the options array
                 this.options[i] = {};
                 // add the value & text items to each object that are passed into the select element
                 this.options[i].value = statuses[i].trim();
                 this.options[i].text = statuses[i];
             }

        },
        methods: {
            emitValue (currentStatus) {
                // this method emits an event named status-value with the value of the chosen status
                // when the component is called this event is listened for, to trigger any actions required
                this.$emit('status-value', currentStatus);
            }
        }
    }
</script>
