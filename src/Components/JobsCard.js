import { Dimensions, Text, View } from 'react-native'
import React from 'react'
import moment from 'moment'
import { useTheme } from 'react-native-paper';


const JobsCard = ({ item, sign }) => {
    const width = Dimensions.get('window').width;
    const { colors } = useTheme();

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap' }}>
            {(sign !== false) ? 
                <Text style={{ color: item?.contract_status === 'signed' ? 'green' : item?.contract_status === 'unsigned' ? "#FC3300" : 'red', textTransform: 'capitalize', fontWeight: '700', position: 'absolute', top: -15, right: 0 }}>{item?.contract_status}</Text>:
                 item?.approved === 1 ? <Text style={{ color: 'green', fontWeight: '700', position: 'absolute', top: -15, right: 0 }}>Approved</Text> :
                    <Text style={{ color: "#FC3300", fontWeight: '700', position: 'absolute', top: -15, right: 0 }}>Not Approved</Text>
            }
            <View>
                <Text style={{ fontSize: width * 0.045, fontWeight: '700', }}>{item?.title}
                </Text>
                <Text style={{ fontSize: width * 0.03, fontWeight: '600', }}>{moment(item?.created_at).format("l")}</Text>
            </View>
            <Text style={{ fontSize: width * 0.035, fontWeight: '600', }}>${(item?.subtotal - item?.discount - item?.manualDiscount)?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
        </View>
    )
}

export default JobsCard;