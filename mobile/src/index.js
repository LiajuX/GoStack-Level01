import React, { useEffect, useState } from 'react';
import { 
  FlatList, 
  Text, 
  StyleSheet, 
  StatusBar, 
  SafeAreaView, 
  TouchableOpacity
} from 'react-native';

import api from './services/api';

export default function App() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get('projects').then(response => {
      console.log(response.data);
      setProjects(response.data);
    });
  }, []);

  async function handleAddProject() {
    const response = await api.post('projects', {
      title: `Novo projeto ${Date.now}`,
      owner: 'Júlia Brito',
    });

    const project = response.data;

    setProjects([...projects, project]);
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159C1" />
      
      <SafeAreaView style={styles.container}>
        <FlatList 
          data={projects}
          keyExtractor={project => project.id}
          renderItem={({ item: project }) => (
            <Text style={styles.project}>{ project.title }</Text>
          )}
          showsVerticalScrollIndicator={false}
        />

        <TouchableOpacity 
          activeOpacity={0.9} 
          style={styles.button} 
          onPress={handleAddProject}
        >
          <Text style={styles.buttonText}>Adicionar projeto</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    padding: 20,
    backgroundColor: '#7159C1',
  },

  project: {
    color: '#FFF',
    fontSize: 20,
  },

  button: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    margin: 15, 
    borderRadius: 4,
    backgroundColor: '#FFF',
  },

  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});