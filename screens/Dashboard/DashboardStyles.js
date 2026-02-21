import { StyleSheet } from "react-native";

export default StyleSheet.create({

  /* MAIN */
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 55,
    backgroundColor: "#F7F9FB"
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center"
  },

  /* TOP BAR */
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15
  },

  profileButton: {
    backgroundColor: "#3A86FF",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    elevation: 2
  },

  logoutButton: {
    backgroundColor: "#E63946",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    elevation: 2
  },

  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignSelf: "center",
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#3A86FF"
  },

  /* MEAL BUTTONS */
  mealRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8
  },

  mealButton: {
    flex: 1,
    backgroundColor: "#8D99AE",
    padding: 12,
    marginHorizontal: 5,
    alignItems: "center",
    borderRadius: 8
  },

  selectedMeal: {
    backgroundColor: "#2EC4B6"
  },

  /* INPUTS */
  input: {
    borderWidth: 1,
    borderColor: "#d0d5dd",
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "#fff"
  },

  addButton: {
    backgroundColor: "#4361EE",
    padding: 14,
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 10,
    elevation: 2
  },

  /* SECTION HEADINGS */
  section: {
    marginTop: 20,
    marginBottom: 6,
    fontWeight: "bold",
    fontSize: 16
  },

  /* MACRO TABLE */
  row: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderColor: "#ddd"
  },

  cell: {
    flex: 1,
    fontSize: 13,
    textAlign: "center",
    paddingVertical: 6
  },
  /* PROGRESS BAR */
  progressContainer: {
    height: 22,
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 10
  },

  progressBar: {
    height: "100%",
    backgroundColor: "#2EC4B6"
  },

  proteinBar: {
    height: "100%",
    backgroundColor: "#FF9F1C"
  },


  /* MEAL LIST */
  mealItem: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#e5e5e5",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 8
  },

  deleteButton: {
    backgroundColor: "#E63946",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6
  },

  /* SCAN + GALLERY */
  uploadButton: {
    backgroundColor: "#3A86FF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 25,
    elevation: 2
  },

  scanButton: {
    backgroundColor: "#2EC4B6",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    elevation: 2
  },

  resetButton: {
    backgroundColor: "#E63946",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    elevation: 2
  },

  headerCell: {
    flex: 1,
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 6
  },

  /* TEXT */
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14
  },

  /* GOAL EDITOR */
  goalEditorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#e0e7ff"
  },

  goalLabel: {
    fontSize: 14,
    color: "#444",
    fontWeight: "600"
  },

  goalValue: {
    color: "#4361EE",
    fontWeight: "bold"
  },

  editGoalIcon: {
    fontSize: 18
  },

  goalInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8
  },

  goalInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#4361EE",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    fontSize: 14,
    color: "#222"
  },

  saveGoalButton: {
    backgroundColor: "#4361EE",
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 8,
    elevation: 2
  }
});