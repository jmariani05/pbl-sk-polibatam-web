<template>
  <layout-app>
    <HeaderTitle title="Setup" subtitle="Tag Group" />

    <div class="card mt-5 mt-sm-10">
      <div class="card-body">
        <button
          class="btn bg-darkblue text-white fs-14"
          @click="handleModalForm(true)"
        >
          <i class="fa fa-plus"></i>
          Add New
        </button>
        <div class="row justify-content-end">
          <div class="col-12 col-sm-5 col-lg-4 col-xl-3">
            <v-text-field
              outlined
              dense
              prepend-inner-icon="mdi-magnify"
              placeholder="Cari..."
              v-model="optionsTable.search"
            />
          </div>
        </div>
        <v-data-table
          :headers="headers"
          :items="reports"
          :options.sync="optionsTable"
          :search="optionsTable.search"
          :loading="isLoading"
        >
          <template v-slot:[`item.created_at`]="{ item }">
            {{ moment(item.created_at).format("DD MMMM YYYY | HH:mm") }}
          </template>
          <template v-slot:[`item.action`]="{ item }">
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  class="btn btn-outline-primary py-4"
                  v-bind="attrs"
                  v-on="on"
                >
                  <span class="fw-light mr-1">Action</span>
                  <i class="fa-solid fa-chevron-down small"></i>
                </v-btn>
              </template>
              <v-list min-width="150">
                <v-list-item @click="handleModalDetail(true, item.id)">
                  <v-list-item-title class="text-primary fs-12">
                    <i class="fa-regular fa-eye small mr-2"></i>
                    <span>Detail</span>
                  </v-list-item-title>
                </v-list-item>
                <v-list-item @click="handleEdit(item.id)">
                  <v-list-item-title class="text-primary fs-12">
                    <i class="fas fa-edit small mr-2"></i>
                    <span>Edit</span>
                  </v-list-item-title>
                </v-list-item>
                <v-list-item @click="handleDelete(item.id)">
                  <v-list-item-title class="text-primary fs-12">
                    <i class="fas fa-trash small mr-2"></i>
                    <span>Delete</span>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </div>
    </div>

    <v-dialog v-if="modalForm" v-model="modalForm" max-width="1200" persistent>
      <Form @handleModalForm="handleModalForm" />
    </v-dialog>
    <v-dialog v-model="modalDetail" max-width="1200" persistent>
      <Detail @handleModalDetail="handleModalDetail" />
    </v-dialog>
  </layout-app>
</template>

<script>
import moment from "moment";
import Swal from "sweetalert2";
import LayoutApp from "../../layouts/layout-app.vue";

export default {
  name: "TagGroup",
  components: {
    LayoutApp,
    HeaderTitle: () => import("@/components/molecules/header-title"),
    Form: () => import("./form.vue"),
    Detail: () => import("./detail.vue"),
  },
  data() {
    return {
      moment,
      headers: [
        { text: "No", value: "no" },
        { text: "Name", value: "name" },
        { text: "Created At", value: "created_at" },
        { text: "Created By", value: "created_by" },
        { text: "Action", value: "action", align: "right", sortable: false },
      ],
      modalForm: false,
      modalDetail: false,
    };
  },
  computed: {
    reports() {
      return this.$store.state.tagGroup.reports;
    },
    isLoading() {
      return this.$store.state.tagGroup.isLoading;
    },
    optionsTable: {
      get() {
        return this.$store.state.tagGroup.optionsTable;
      },
      set(value) {
        this.$store.commit("SET_OPTIONS_TABLE_TAG_GROUP", value);
      },
    },
  },
  methods: {
    async handleModalForm(value) {
      this.modalForm = value;
      if (value) {
        await this.$store.dispatch("GetFilterPegawai").then(() => {
          this.$store.dispatch("GetAllPegawai");
        });
      }
    },
    handleModalDetail(value, id) {
      if (value) this.$store.dispatch("GetDetailTagGroup", id);
      this.modalDetail = value;
    },
    async handleEdit(id) {
      await this.handleModalForm(true);
      await this.$store.dispatch("SetFormUpdateTagGroup", id);
      await this.$store.commit("SET_IS_UPDATE_TAG_GROUP", id);
    },
    handleDelete(id) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          this.$store.dispatch("DeleteTagGroup", id);
        }
      });
    },
  },
  mounted() {
    this.$store.dispatch("GetAllTagGroup");
  },
};
</script>
