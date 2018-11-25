<template>
    <v-app>
        <v-toolbar app color="primary" dark fixed>
            <v-toolbar-title class="headline text-uppercase">
                <span>Vigenere </span>
                <span class="font-weight-light">Cipher</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn flat to="/">
                    Home
                </v-btn>
                <v-divider vertical></v-divider>
                <v-btn flat to="/encrypt">
                    Encrypt
                </v-btn>
                <v-divider vertical></v-divider>
                <v-btn flat to="/decrypt">
                    Decrypt
                </v-btn>
                <v-divider vertical></v-divider>
                <v-btn flat to="/decrypt-brute">
                    Decrypt Bruteforce
                </v-btn>
                <v-divider vertical></v-divider>
                <v-btn flat to="/decrypt-pso">
                    Decrypt PSO
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>

        <v-content>
            <v-container grid-list-xl>
                <router-view/>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
    export default {
        name: 'App',
        components: {},
        data() {
            return {}
        }
    }
</script>
