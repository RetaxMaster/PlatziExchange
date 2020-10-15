<template>
    <div>
        
        <!-- v-bind: puede ser reemplazado por ":" -->
        <px-assets-table v-show="!isLoading" :assets="assets" />
    </div>
</template>

<script>
import PxAssetsTable from "@/components/PxAssetsTable";
import api from "@/api";

export default {

    name: "Home",

    components: {
        PxAssetsTable
    },

    data() {
        return {
            assets: [],
            isLoading: false
        }
    },

    created() {

        this.isLoading = true;
        api.getAssets()
            .then(assets => (this.assets = assets))
            .finally(() => this.isLoading = false);

    }

}

</script>