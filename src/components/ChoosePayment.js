import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, ImageBackground} from "react-native";
import {Container, Content, Header, Button, Left, Icon, Body, Title} from 'native-base'
import styles from '../../assets/style'
import { DoubleBounce } from 'react-native-loader';
import {connect} from "react-redux";
import {NavigationEvents} from "react-navigation";
import i18n from "../../locale/i18n";
import {getOrderStore} from '../actions'


class ChoosePayment extends Component {
    constructor(props){
        super(props);

        this.state={
        }
    }

    componentWillMount() {
    }


    renderLoader(){
        if (this.props.loader){
            return(
                <View style={[styles.loading, styles.flexCenter]}>
                    <DoubleBounce size={20} />
                </View>
            );
        }
    }

    setOrder(type){
		const provider_id             = this.props.navigation.state.params.provider_id;
		const shipping_price          = this.props.navigation.state.params.shipping_price;
		const address                 = this.props.navigation.state.params.address;
		const lat                     = this.props.navigation.state.params.latitude;
		const lng                     = this.props.navigation.state.params.longitude;
		const payment_type            = type;

		this.props.getOrderStore(this.props.lang, provider_id , payment_type , shipping_price.toString() , lat , lng , address , this.props.user.token  , this.props )

		// this.props.navigation.navigate('FormPayment' , {
		// 	provider_id             : this.props.navigation.state.params.provider_id,
		// 	shipping_price          : this.props.navigation.state.params.shipping_price,
		// 	address                 : this.props.navigation.state.params.address,
		// 	lat                     : this.props.navigation.state.params.latitude,
		// 	lng                     : this.props.navigation.state.params.longitude,
		// 	payment_type            : type,
		// })
    }

    onFocus(){
        this.componentWillMount();
    }
    render() {
        return (
            <Container>

                <NavigationEvents onWillFocus={() => this.onFocus()} />

                <Header style={styles.headerView}>
                    <Left style={styles.leftIcon}>
                        <Button style={styles.Button} transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon style={[styles.text_black, styles.textSize_22]} type="AntDesign" name='right' />
                        </Button>
                    </Left>
                    <Body style={styles.bodyText}>
                        <Title style={[styles.textRegular , styles.text_black, styles.textSize_20, styles.textLeft, styles.Width_100, styles.paddingHorizontal_0, styles.paddingVertical_0]}>
                            { i18n.t('pay') }
                        </Title>
                    </Body>
                </Header>
                <ImageBackground source={require('../../assets/images/bg_img.png')} style={[styles.bgFullWidth]}>
                <Content  contentContainerStyle={styles.bgFullWidth} style={styles.bgFullWidth}>
                        <View style={[styles.rowGroup , styles.paddingHorizontal_10, styles.marginVertical_10]}>
                            <TouchableOpacity onPress={() => this.setOrder(0)} style={[styles.bg_White , styles.Border, styles.flex_45, styles.flexCenter, styles.Radius_5, styles.marginHorizontal_5, styles.height_120, styles.marginVertical_10]}>
                                <Image
                                    style       = {[styles.width_70 , styles.height_70, styles.flexCenter]}
                                    source      = {require('../../assets/images/cash.png')} resizeMode={'cover'}
                                />
                                <Text
                                    style={[styles.textBold, {color:'#ed8928'}, styles.marginHorizontal_5]}>{i18n.translate('cash')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setOrder(1)} style={[styles.bg_White , styles.Border, styles.flex_45, styles.flexCenter, styles.Radius_5, styles.marginHorizontal_5, styles.height_120, styles.marginVertical_10]}>
                                <Image
                                    style       = {[styles.width_70 , styles.height_70, styles.flexCenter]}
                                    source      = {require('../../assets/images/visa_master.png')} resizeMode={'cover'}
                                />
                                <Text
                                    style={[styles.textBold, {color:'#0d6bb4'}, styles.marginHorizontal_5]}>{i18n.translate('visa')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setOrder(2)} style={[styles.bg_White , styles.Border, styles.flex_45, styles.flexCenter, styles.Radius_5, styles.marginHorizontal_5, styles.height_120, styles.marginVertical_10]}>
                                <Image
                                    style       = {[styles.width_70 , styles.height_70, styles.flexCenter]}
                                    source      = {require('../../assets/images/paypal.png')} resizeMode={'cover'}
                                />
                                <Text
                                    style={[styles.textBold, {color:'#20a2e0'}, styles.marginHorizontal_5]}>{i18n.translate('payPal')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setOrder(3)} style={[styles.bg_White , styles.Border, styles.flex_45, styles.flexCenter, styles.Radius_5, styles.marginHorizontal_5, styles.height_120, styles.marginVertical_10]}>
                                <Image
                                    style       = {[styles.width_70 , styles.height_70, styles.flexCenter]}
                                    source      = {require('../../assets/images/sadad.png')} resizeMode={'cover'}
                                />
                                <Text
                                    style={[styles.textBold, {color:'#ef7e31'}, styles.marginHorizontal_5]}>{i18n.translate('sdad')}</Text>
                            </TouchableOpacity>
                        </View>
                </Content>
                </ImageBackground>
            </Container>

        );
    }
}

const mapStateToProps = ({lang , profile}) => {
	return {
		lang: lang.lang,
		user: profile.user,
	};
};
export default connect(mapStateToProps, {getOrderStore})(ChoosePayment);
