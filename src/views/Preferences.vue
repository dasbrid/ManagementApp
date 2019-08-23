<template>
  <div class="hello">
   <H1 v-if="dataLoaded==false">
     Loading preferences
   </h1>
   <b-container v-if="dataLoaded==true" fluid>
        <b-row class="my-2">
            <b-col md="12">
            <H1>
                Configuration management
            </H1>
            </b-col>
        </b-row>
        <b-row class="my-2">
            <b-col md="12">
                <b-form-group label-cols-sm="6" label="Number of mail items that can be tracked in a single call" class="mb-0">
                <b-form-input v-model="numMailitems" type="number" min="0" max="20" placeholder="Number of mail items"></b-form-input>
                </b-form-group>
            </b-col>
        </b-row>
        <b-row class="my-2">
            <b-col md="12">
                <span v-if="!numMailitemsValid">
                The number of mail items is not valid
                </span>
            </b-col>
        </b-row>

        <b-row class="my-2">
            <b-col md="12">
                <b-form-group label-cols-sm="6"  label="List of mailitem event types to be tracked (separated with comma):" class="mb-0">
                    <b-form-input v-model="itemEvents" pattern="^[0-9]+(\s*,\s*[0-9]+)*$" placeholder="Mail item events"></b-form-input>
                </b-form-group>
            </b-col>
        </b-row>
        <b-row>
            <b-col md="12">
            <span v-if="!itemEventsValid">
            The list of mailitem events is not valid
            </span>
            </b-col>
        </b-row>

        <b-row class="my-2">
            <b-col md="12">
        <b-form-group label-cols-sm="6" label="Absolute path where to store signature images:" class="mb-0">
            <b-form-input v-model="pathToStoreSignatureImg" placeholder="Signature image path"></b-form-input>
        </b-form-group>
            </b-col>
        </b-row>
        <b-row>
            <span v-if="!pathToStoreSignatureImgValid">
            The signature path is not valid
            </span>
        </b-row>

        <b-row class="my-2">
            <b-col md="10">
                <b-form-group label-cols-sm="5" label="Track and Trace mail item events not older than (Number of days):" class="mb-0">
                <b-form-input v-model="numDays" type="number" min="0" max="730" placeholder="Number of days" :disabled="doNotUse"></b-form-input>
                </b-form-group>
            </b-col>
            <b-col md="2">
                <input type="checkbox" id="checkbox" v-model="doNotUse">
                <label for="checkbox">Do not use</label> 
            </b-col>
        </b-row>

        <b-row>
            <span v-if="!numDaysValid">
            The number of days specified is not valid
            </span>
        </b-row>

    <b-row>
        <b-col md="6" class="my-1">
        <b-button @click="storeConfig()" :disabled="!canStore">Store</b-button>
        </b-col>
    </b-row>

  </b-container>

</div>
</template>
<script>
/* eslint-disable */
import axios from "axios"; // for calling APIs

export default {
  name: 'Preferences',
  data() {
    return {
        doNotUse: false,
        itemEvents: null,
        numDays: null,
        numMailitems: null,
        pathToStoreSignatureImg: null,
        dataLoaded:false
    }
  },
  components: {
    // an imported components.
},
  computed: {
        // Computed props go here
    canStore () {
        if (!this.itemEventsValid)
            return false
        if (!this.numDaysValid)
            return false
        if (!this.numMailitemsValid)
            return false
        if (!this.pathToStoreSignatureImgValid)
            return false
        return true
    },
    numDaysValid () {
        if (this.doNotUse)
            return true
        if (this.numDays < 0)
            return false
        if (this.numDays > 750)
            return false
        return true
    },
    numMailitemsValid () {
        if (!this.numMailitems)
            return false
        if (this.numMailitems < 0)
            return false
        if (this.numMailitems > 20)
            return false
        return true
    },
    itemEventsValid () {
        if (!this.itemEvents)
            return false
/*            
        let patt = /^[0-9]+(\s*,\s*[0-9]+)*$/
        let result = this.itemEvents.match(patt);
        if (!result)
            return false
*/            
        return true
    },
    pathToStoreSignatureImgValid () {
        if (!this.pathToStoreSignatureImg)
          return true // this is alowed to be empty
        // ... but if it isn't empty it must be valid
        // This regex isn't really correct, but it eliminates the windows non-allowed chars
        
        /*var patt = /[\|<>"*?]/;
        var result = this.pathToStoreSignatureImg.match(patt);
        if (result)
            return false
        */
        return true
    }
  },
  props: {
    msg: String
  },
    mounted () {
        this.fetchConfig();
  },
  watch: {
      doNotUse(newValue, oldValue) {
          if (newValue == true)
          {
              this.numDays = 0
          } else {
              this.numDays = 365
          }
      }
  },
  methods: {
    fetchConfig() {
    axios.get ("https://localhost:5001/api/config")
    .then(response => {
        console.log(response);
        this.itemEvents = response.data.eventListTracked
        this.numDays = response.data.ttNumberOfDays
        this.numMailitems = response.data.nbMailItems
        this.pathToStoreSignatureImg = response.data.pathToStoreSignatureImg
        if (this.numDays == 0)
        {
            this.doNotUse = true
        }
        this.dataLoaded = true;
    })
    .catch(error=> {
        console.log(error);
    })
  },
  storeConfig() {
            axios.put("https://localhost:5001/api/config",
            {
                NbMailItems: this.numMailitems,
                EventListTracked: this.itemEvents,
                PathToStoreSignatureImg:this.pathToStoreSignatureImg,
                TTNumberOfDays:this.numDays
            })
            .then(response => {
                console.log(response);
                this.$bvModal.msgBoxOk('Configuration Updated')
            })
            .catch(error=> {
                console.log("Error"+ error);
                this.$bvModal.msgBoxOk('Something went wrong :(')
            })
        },
  }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  text-align: left;
}
h1 {
  text-align: center
}
</style>