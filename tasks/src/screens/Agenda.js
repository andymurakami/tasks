import React, { Component } from 'react'
import { Text, StyleSheet, View, ImageBackground, FlatList, Platform, TouchableOpacity, AsyncStorage } from 'react-native'
import moment from 'moment'
import 'moment/locale/pt-br'
import todayImage from '../../assets/imgs/today.jpg'
import commomStyles from '../commomStyles'
import Task from '../components/Task';
import Icon from 'react-native-vector-icons/FontAwesome'
import ActionButton from 'react-native-action-button'
import AddTask from './AddTask'


//  npm start -- --reset-cache
//  emulator -avd Nexus_5X_API_28_x86
// rm -r build
// react-native run-android

export default class Agenda extends Component {
    state = {
        tasks: [ ],
        visibleTasks: [

        ],
        showDoneTasks : true,

        showAddTask: false,
    }


    deleteTask = id => {
        const tasks = this.state.tasks.filter(task => task.id !== id)

        this.setState( { tasks }, this.filterTasks )

    }

    addTask = task => {
        const tasks = [...this.state.tasks]

        tasks.push( {
            id: Math.random(),
            desc:  task.desc,
            estimateAt: task.date,
            doneAt: null,

        })
        this.setState( { tasks, showAddTask: false }, this.filterTasks)
    }

    toggleFilter = () => {
        this.setState({ showDoneTasks: !this.state.showDoneTasks}, this.filterTasks)

    }

    componentDidMount = async () => {
        const data = await AsyncStorage.getItem('tasks')
        const tasks = JSON.parse(data) || []
        this.setState({tasks},this.filterTasks)
        
    }

    filterTasks = () => {
        let visibleTasks = null
        if (this.state.showDoneTasks){
            visibleTasks = [...this.state.tasks]
        } else {
            const pending = task => task.doneAt === null
            visibleTasks = this.state.tasks.filter(pending)
        }
        this.setState( { visibleTasks })
        AsyncStorage.setItem('tasks', JSON.stringify(this.state.tasks))

    }

    onToggleTask = id => {

        // com MAP
        // const tasks = this.state.tasks.map( task => {
        //     if (task.id === id){
        //         task = {...task}
        //         task.doneAt = task.doneAt ? null : new Date()
        //     }
        //     return task
        // })
        
        // com forEach

        const tasks = [...this.state.tasks]
        tasks.forEach( task => {
            if (task.id === id){
                task.doneAt = task.doneAt ? null : new Date()
            }
        })

        // aqui ele pega todas as taks e clona, retorna todas apenas com a procurada com alteração


        this.setState({ tasks } , this.filterTasks)

    }


    render () {
        return (
            <View style={styles.container}>
              
                  <AddTask isVisible={this.state.showAddTask} 
                  onSave={this.addTask}
                  onCancel={ () => this.setState({ showAddTask: false})}></AddTask>
                
                
                <ImageBackground  source={todayImage} 
                    style={styles.background}>
                    <View style={styles.iconBar}>
                        <TouchableOpacity onPress={this.toggleFilter}>
                            <Icon name={this.state.showDoneTasks ? 'eye' : 'eye-slash'} 
                                size={20} color={commomStyles.colors.secondary}>
                            </Icon>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>Hoje</Text>
                            <Text style={styles.subtitle}>
                            {
                                moment().locale('pt-br').format('ddd, D [de] MMMM')
                            }
                        </Text>
                    </View>
                </ImageBackground>
                <View style={styles.taksContainer} >
                    <FlatList data={this.state.visibleTasks} 
                            keyExtractor={ item => `${item.id}`}
                            renderItem={({item}) => 
                                <Task {...item} onToggleTask={this.onToggleTask} 
                                        onDelete={this.deleteTask }
                                 >
                                </Task>
                            } 
                    >
                    </FlatList>
                </View>
                <ActionButton buttonColor={commomStyles.colors.today}
                    onPress={() => { this.setState({ showAddTask: true }) }}></ActionButton>

                

                
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
     container: {
        flex: 1,
    },
    background:{
        flex: 3,  
    },
    titleBar:{
        flex:1,
        justifyContent: 'flex-end',
    },
    title: {
        fontFamily: commomStyles.fontFamily,
        color: commomStyles.colors.secondary,
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 10,
    },
    subtitle: {
        fontFamily: commomStyles.fontFamily,
        color: commomStyles.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 30,

    },
    taksContainer :{
        flex: 7,
    },
    iconBar: {
        marginTop : Platform.OS === 'ios' ? 30 : 10,
        marginHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    }
})