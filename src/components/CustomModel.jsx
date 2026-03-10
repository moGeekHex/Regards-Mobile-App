import React from 'react';
import {
  View,
  StyleSheet,
  Button,
  Modal,
  Image,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';

const CustomModel = ({show, closePress, text}) => {
     const [showModal, setShowModal] = React.useState(show);

  const scaleValue = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    toggleModal();
  }, [show]);
  const toggleModal = () => {
    if (show) {
      setShowModal(true);
      Animated.spring(scaleValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => setShowModal(false), 1000);
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };
  return (
     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Modal transparent visible={show}>
               <View style={styles.modalBackGround}>
                    <Animated.View style={[styles.modalContainer, {transform: [{scale: scaleValue}]}]}>
                         <View style={{alignItems: 'center'}}>
                              <View style={styles.header}>
                                   <TouchableOpacity onPress={closePress}>
                                        <Image
                                             source={require("../assets/images/x.png")}
                                             style={{height: 30, width: 30}}
                                        />
                                   </TouchableOpacity>
                              </View>
                         </View>
                         <View style={{alignItems: 'center'}}>
                              <Image
                                   source={require('../assets/images/close.png')}
                                   style={{height: 125, width: 125, marginVertical: 10}}
                              />
                         </View>

                         <Text style={{marginVertical: 30, fontSize: 18, textAlign: 'center', color : "#333"}}>
                              {text}
                         </Text>
                    </Animated.View>
               </View>
          </Modal>
     </View>
  );
};


const styles = StyleSheet.create({
  modalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
  },
  header: {
    width: '100%',
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

export default CustomModel;