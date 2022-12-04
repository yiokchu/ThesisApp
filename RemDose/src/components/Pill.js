import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import { colors } from '../config/colors';

const Pill = (props) => {
    return (
        <View style={styles.item}>
            <View style={styles.itemLeft}>
                <Image 
                    style={styles.remImg}
                    source= { props.value2 === 'Image1' ? require('../../assets/pill1.png') :
                    props.value2 === 'Image2' ? require('../../assets/pill2.png') :
                    props.value2 === 'Image3' ? require('../../assets/pill3.png') : require('../../assets/pill1.png')
                    }
                />
                <View>
                    <Text style={styles.remText} key = {props.value3}> {props.text} </Text>
                    <Text style={styles.doseText}> {props.value} CAPSULE(S)</Text>
                </View>
            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    remImg: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    remText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textBlack,
    },
    doseText: {
        fontSize: 12,
        color: colors.textGray,
    },
});

export default Pill;