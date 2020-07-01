<template>
    <div class="z-location-select">
        <div class="form-group">
            <label class="mb-1" :for="selectId">{{selectLabel}}</label>
            <b-form-select ref="zLocationSelect" @input="emitValue" :value="value" :id="selectId"  :options="options" :require="true">
                <template v-slot:first>
                    <option :value="null" disabled>Please select</option>
                </template>
            </b-form-select>
        </div>
    </div>
    
</template>

<script>
    export default {
        name: "ZLocationSelect",
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
            // fetch locations from store


            let locations = this.$store.getters.getIntakeLocations;
            // loop through and apply to select value / text / pairs
             for(var i =0; i < locations.length; i++) {
                 this.options[i] = {};
                 this.options[i].value = locations[i].City + ',' + locations[i].Country ;
                 this.options[i].text = locations[i].City;
             }
        },

        methods: {
            emitValue (currentVal) {
                this.$emit('location-value', currentVal);
            }
        }
    }
</script>
