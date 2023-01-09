import { StyleSheet, Dimensions} from 'react-native';
const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewContainer: { flex: 1, width: '100%', paddingBottom: 20 },
  scrollViewContainer: {
    paddingVertical: "3%",
    paddingHorizontal: "2%",
  },
  
  mainContainer: {
    flex: 1, 
    justifyContent: 'center', 
    paddingBottom: 50, 
    paddingHorizontal: 5
 }, 
 scrollView: {
   paddingTop: 10,
   paddingHorizontal: 5
 },
 viewItem: {
   paddingVertical: 5,
 },
 listItem: {
   marginBottom: 10,
 },
 itemCenter: {
   flexDirection: 'row', 
   justifyContent: 'center', 
   alignItems: 'center'
 },
 itemLeft: {
   flexDirection: 'row', 
   justifyContent: 'flex-start', 
   alignItems: 'center'
 },
 itemRight: {
   flexDirection: 'row', 
   justifyContent: 'flex-end', 
   alignItems: 'center'
 },
 itemSpaceBetween: {
   flexDirection: 'row', 
   justifyContent: 'space-between', 
   alignItems: 'center'
 },
 itemActivity: {
   backgroundColor: 'darkgreen',
   padding: 10,
   borderRadius: 5
 },
 textActivity: {
   color: 'white',
   fontSize: 18,
   lineHeight: 24     
 },
 spaceActivity: {
   height: 50,
 },
 
 titleText: {
   fontSize: 20,
   fontWeight: 'bold'   
 },
 
 headingText: {
   fontSize: 18,
   lineHeight: 22,
   paddingVertical: 5
 }, 
 subjectText: {
   fontSize: 22,
   lineHeight: 36
 },
 shopNameText: {
   lineHeight: 28,
   fontSize: 20,
   fontWeight: 'bold'   
 },
 mealNameText: {
   fontSize: 18,
   lineHeight: 24,
   fontWeight: 'bold' 
 },
 descrText: {
   fontSize: 18,
   lineHeight: 24
 },
 loading: {
   position: 'absolute',
   left: 0,
   right: 0,
   top: 0,
   bottom: 0,
   opacity: 0.5,
   backgroundColor: 'black',
   justifyContent: 'center',
   alignItems: 'center'
 },

  
  
  /*
  paragraphView: {
     width: "100%",
     marginBottom: 10        
  },
  tableView: {
     width: "100%",
     paddingBottom: 30        
  },
  listButtonView: {
     flexDirection: 'row', 
     justifyContent: 'space-between', 
     paddingBottom: 10
  },
  titleText: {
     fontSize: 20,
     fontWeight: 'bold'
  }, 
  tableHead: { height: 50, borderBottomWidth: 1},
  rowStyle: { flexDirection: 'row', height: 50, borderBottomWidth: 1, borderBottomColor: 'lightgrey'},

  dropdownBtnStyle: {
   width: "100%",
   height: 50,
   backgroundColor: "#FFF",
   borderRadius: 8,
   borderWidth: 1,
   borderColor: "#444",
 },
 dropdownBtnTxtStyle: { color: "#444", textAlign: "left" },
 dropdownDropdownStyle: { backgroundColor: "#EFEFEF" },
 dropdownRowStyle: {
   backgroundColor: "#EFEFEF",
   borderBottomColor: "#C5C5C5",
 },
 dropdownRowTxtStyle: { color: "#444", textAlign: "left" },
 */ 
  
  
  
  
  
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    width,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6F6F6",
  },
  headerTitle: { color: "#000", fontWeight: "bold", fontSize: 18 },
  saveAreaViewContainer: { flex: 1, backgroundColor: "#000" },
  viewContainer: { flex: 1, width, backgroundColor: "#FFF", paddingBottom: 20 },
  scrollViewContainer: {
    paddingVertical: "5%",
    paddingHorizontal: "5%",
  },
  verticalView: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    //paddingHorizontal: "5%",
    alignItems: 'center'  
  },
  horizontalView: {
    width: "100%",
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
  },
  horizontalElement: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputTextContainer: {
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginTop: 10,
  },
  inputText: {
    width: '100%',
    height: 25,
    fontSize: 16,
  }, 
  titleText: {
    fontSize: 20,
    fontWeight: 'bold'
  }, 
  subTitleText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  descriptionText: {
    fontSize: 18,
    lineHeight: 24
  },
  linkText: {
    fontSize: 18, 
    lineHeight: 24, 
    color: '#0084ff'
  },
  boldText: {
    fontWeight: 'bold'
  },
  image: {
    height: 150,
    width: 150,
    borderRadius: 150,
    marginBottom: 20,
  },
});
