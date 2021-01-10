import React from "react"
import {Text,View,TouchableOpacity,StyleSheet,Image,TextInput,KeyboardAvoidingView, ToastAndroid} from "react-native"
import * as Permissions from "expo-permissions";
import {BarCodeScanner} from "expo-barcode-scanner"
import db from "../config";
import * as firebase from "firebase"

export default class TransactionsScreen extends React.Component{
    constructor(){
        super();
        this.state={
            hasCameraPermissions:null,
            scanned:false,
            scannedBookId:"",
            scannedStudentId:"",
            buttonsState:"normal",
            transactionMessage:""
        }
    }

    handleBarCodeScanned=async({type,data})=>{
        const {buttonsState}=this.state
        if(buttonsState==="BookID"){
            this.setState({
                scanned:true,
                scannedBookId:data,
                buttonsState:"normal"
            });
        }
        else if (buttonsState==="StudentID"){
            this.setState({
                scanned:true,
                scannedStudentId:data,
                buttonsState:"normal"
            });
        }
    }

    getCameraPermissions=async(id)=>{
        const {status}=await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermissions:status==="granted",
            buttonsState:id,
            scanned:false
        })
    }

    initiateBookIssue=async()=>{
        db.collection("transactions").add({
            bookId:this.state.scannedBookId,
            studentId:this.state.scannedStudentId,
            date:firebase.firestore.Timestamp.now().toDate(),
            transactionType:"issue"
        });

        db.collection("books").doc(this.state.scannedBookId).update({
            bookAvailability:false
        })
        
        db.collection("Students").doc(this.state.scannedStudentId).update({
            numberOfBookIssued:firebase.firestore.FieldValue.increment(1)
        })
        this.setState({
            scannedBookId:"",
            scannedStudentId:""

        })
    }

    initiateBookReturn=()=>{
        db.collection("transactions").add({
            bookId:this.state.scannedBookId,
            studentId:this.state.scannedStudentId,
            data:firebase.firestore.Timestamp.now().toDate(),
            transactionType:"return"
        });

        db.collection("books").doc(this.state.scannedBookId).update({
            bookAvailability:true
        })

        db.collection("Students").doc(this.state.scannedStudentId).update({
            numberOfBookIssued:firebase.firestore.FieldValue.increment(-1)
        })
        this.setState({
            scannedBookId:"",
            scannedStudentId:""
        })
    }
    checkBookEligibility=async()=>{

    }
    checkStudentEligibilityIssue=async()=>{
        
        const ref=await db.collection("Students").where("studentId","==",this.state.scannedStudentId).get()
        var isStudentIlegible=""
        if (ref.docs.length==0){
            this.setState({
                scannedBookId:"",
                ScannedStudentId:""
            })    
            isStudentIlegible=false;
            alert("student doesnt exist")
            
        }
        else{
            ref.docs.map((doc)=>{
                var student=doc.data();
                if(student.numberOfBookIssued>2){
                    isStudentIlegible=false;
                    alert("student has already has issued 2 books") 
                    this.setState({
                        scannedBookId:"",
                        ScannedStudentId:""
                    })   
                }
                else{
                    isStudentIlegible=true;

                }
            })
        }
       return isStudentIlegible;     
    }
    checkStudentEligibilityReturn=async=()=>{

    }
    handleTransaction=async()=>{

        var transactionType=await this.checkBookEligibility()
        if(!transactionType){
            alert(" Book does not exist in library ")
            this.setState({
                scannedBookId:"",
                scannedStudentId:""
            })
        }
        else if(transactionType==="issue"){
            var eligibilIssue=await this.checkStudentEligibilityIssue()
            if(eligibilIssue){
                this.initiateBookIssue();
                alert("Book Issued")
            }
        }
        else{
            var eligibilReturn=await this.checkStudentEligibilityReturn()
            if(eligibilReturn){
                this.initiateBookReturn();
                alert("Book Return")
            }

        }
       // var transactionmessage=""
        //db.collection("books").doc(this.state.scannedBookId).get()
        //.then((doc)=>{
          //  var book=doc.data();
          //  if(book.bookAvailability){
            //    this.initiateBookIssue();
             //   transactionmessage="book issued"
                //ToastAndroid.show(transactionmessage,ToastAndroid.SHORT)
          //  }
           // else{
              //  this.initiateBookReturn();
             //   transactionmessage="book return"
                //ToastAndroid.show(transactionmessage,ToastAndroid.SHORT)
           // }
       // })
        //this.setState({
           // transactionMessage:transactionmessage
        //})
    }

    render(){
        const hasCameraPermissions=this.state.hasCameraPermissions;
        const scanned=this.state.scanned;
        const buttonsState=this.state.buttonsState;
        if(buttonsState!=="normal" && hasCameraPermissions){
            return(
                <BarCodeScanner
                    onBarCodeScanned={
                        scanned
                        ?undefined
                        :this.handleBarCodeScanned
                    }       
                    style={StyleSheet.absoluteFillObject}         
                />
            )
        }

        else if(buttonsState==="normal"){
            return(
                <KeyboardAvoidingView behaviour="padding" style={styles.container}>
                    <View>
                        <Image
                        source={require("../assets/booklogo.jpg")}
                        style={{
                          width:200,
                          height:200  
                        }}
                        />
                        <Text style={{
                            textAlign:"center",
                            fontSize:30,

                        }}>WIRELESS LIBRARY</Text>
                        
                    </View>
                    <View>
                        <TextInput
                            placeholder="Book ID"
                            style={styles.inputbox}
                            onChangeText={(text)=>{this.setState({scannedBookId:text})}}
                            value={this.state.scannedBookId}
                        />
                        <TouchableOpacity 
                        onPress={()=>{this.getCameraPermissions("BookID")}}
                        style={styles.scanbutton}>
                            <Text>scan qr code</Text>
        
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TextInput
                            placeholder="Student ID"
                            style={styles.inputbox}
                            onChangeText={(text)=>{this.setState({scannedStudentId:text})}}
                            value={this.state.scannedStudentId}
                        />
                        <TouchableOpacity 
                        onPress={()=>{this.getCameraPermissions("StudentID")}}
                        style={styles.scanbutton}>
                            <Text>scan qr code</Text>
        
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity 
                    onPress={()=>{this.handleTransaction();
                        this.setState({
                            scannedBookId:"",
                            scannedStudentId:""
                        })
                    }}

                    style={styles.submitbutton}>
                        <Text>Submit</Text>
                     </TouchableOpacity>
                </KeyboardAvoidingView>
                )
        }
   
    }
}
const styles= StyleSheet.create(
{
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    },
    scanbutton:{
        padding:10,
        margin:10,
        backgroundColor:"red",
        borderWidth:3,
        borderRadius:5

    },    
    inputbox:{
        width:200,
        height:40,
        borderWidth:2,

    },
    submitbutton:{
        backgroundColor:"green",
        borderWidth:2,
        width:100,
        height:30,
        justifyContent:"center",
        alignItems:"center"

    }
}
)
