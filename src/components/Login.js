import React, {Component} from "react";import {View, Text, Image, TouchableOpacity, ImageBackground, AsyncStorage, KeyboardAvoidingView , Dimensions} from "react-native";import {	Container,	Content,	Form,	Item,	Input,	Button,	Toast,	Icon,	Left,	Body,	Title,	Right,	Header,} from 'native-base'import styles from '../../assets/style'import i18n from '../../locale/i18n'import {DoubleBounce} from "react-native-loader";import {NavigationEvents} from "react-navigation";import * as Animatable from 'react-native-animatable';import {connect} from 'react-redux';import {chooseLang, profile, userLogin} from '../actions'import * as Permissions from 'expo-permissions';import {Notifications} from 'expo'import Spinner from "react-native-loading-spinner-overlay";const IS_IPHONE_X 	= (height === 812 || height === 896) && Platform.OS === 'ios';const height = Dimensions.get('window').height;class Login extends Component {    constructor(props) {        super(props);        this.state = {            phone: '',            password: '',            deviceId: '',            userId: null,            type: 0,            phoneStatus: 0,            passwordStatus: 0,            spinner: false,        }    }    activeInput(type) {        if (type === 'phone' || this.state.phone !== '') {            this.setState({phoneStatus: 1})        }        if (type === 'password' || this.state.password !== '') {            this.setState({passwordStatus: 1})        }    }    unActiveInput(type) {        if (type === 'phone' && this.state.phone === '') {            this.setState({phoneStatus: 0})        }        if (type === 'password' && this.state.password === '') {            this.setState({passwordStatus: 0})        }    }    validate = () => {        let isError = false;        let msg = '';        if (this.state.phone.length <= 0) {            isError = true;            msg = i18n.t('namereq');        } else if (this.state.password.length <= 0) {            isError = true;            msg = i18n.t('pass');        }        if (msg !== '') {            Toast.show({                text: msg,                type: "danger",                duration: 3000,                textStyle: {                    color: "white",                    fontFamily: 'cairo',                    textAlign: 'center',                }            });        }        return isError;    };    renderSubmit() {        if (this.state.password == '' || this.state.phone == '') {            return (                <TouchableOpacity                    style={[                        styles.bg_orange,                        styles.width_150,                        styles.flexCenter,                        styles.marginVertical_15,                        styles.height_40,                        {                            backgroundColor: '#999'                        }                    ]}>                    <Text style={[styles.textRegular, styles.textSize_14, styles.text_White]}>                        {i18n.translate('login')}                    </Text>                </TouchableOpacity>            );        }        return (            <TouchableOpacity                style={[                    styles.bg_orange,                    styles.width_150,                    styles.flexCenter,                    styles.marginVertical_15,                    styles.height_40                ]}                onPress={() => this.onLoginPressed()}>                <Text style={[styles.textRegular, styles.textSize_14, styles.text_White]}>                    {i18n.translate('login')}                </Text>            </TouchableOpacity>        );    }    onLoginPressed() {        const { userType } = this.props.navigation.state.params;        this.setState({spinner: true});        const err = this.validate();        if (!err) {            const {phone, password, deviceId, userType} = this.state;            this.props.userLogin({phone, password, deviceId, userType}, this.props.lang);        }    }    async componentWillMount() {        this.setState({userType : this.props.navigation.state.params.userType});        console.log('userType', this.props.navigation.state.params.userType);        const {status: existingStatus} = await Permissions.getAsync(            Permissions.NOTIFICATIONS        );        let finalStatus = existingStatus;        if (existingStatus !== 'granted') {            const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);            finalStatus = status;        }        if (finalStatus !== 'granted') {            return;        }        const deviceId = await Notifications.getExpoPushTokenAsync();        this.setState({deviceId, userId: null});        AsyncStorage.setItem('deviceID', deviceId);    }    componentWillReceiveProps(newProps) {        console.log('newProps __ msg', newProps.msg);        if (newProps.auth !== null && newProps.auth.key === 1) {            if (this.state.userId === null) {                this.setState({userId: newProps.auth.data.id});                this.props.profile(newProps.auth.data.token);            }            this.props.navigation.navigate('drawerNavigator');        }        if (newProps.auth !== null) {            if( newProps.auth.key === 3 ){                this.props.navigation.navigate('ActivationCode', {                    code			: newProps.auth.data.code,                    user_id			: newProps.auth.data.id,                    phone			: this.state.phone,                    password		: this.state.password,                });            }            this.setState({spinner: false});        }    }    onFocus() {        this.componentWillMount()    }    render() {        // const { userType } = this.props.navigation.state.params;        return (            <Container>                <Spinner                    visible={this.state.spinner}                />                <ImageBackground source={require('../../assets/images/background.png')} style={[styles.bgFullWidth]}>                <NavigationEvents onWillFocus={() => this.onFocus()}/>					<Header style={styles.headerView}>						<Left style={styles.leftIcon}>							<Button style={styles.Button} transparent								onPress={() => this.props.navigation.goBack()}>								<Icon style={[styles.text_black, styles.textSize_22]} type="AntDesign" name='right'/>							</Button>						</Left>						<Body style={styles.bodyText} />					</Header>                <Content contentContainerStyle={styles.bgFullWidth}>                        <View                            style={[styles.position_R, styles.bgFullWidth, styles.marginVertical_15, styles.SelfCenter, styles.Width_100]}>                            <Animatable.View animation="fadeInDown" easing="ease-out" delay={500}                                             style={[styles.flexCenter]}>                                <View style={[styles.overHidden, styles.marginVertical_15]}>                                    <Image style={[styles.icoImage]} source={require('../../assets/images/logo.png')}/>                                </View>                            </Animatable.View>                            <KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoid}>                                <Form                                    style={[styles.Width_100, styles.flexCenter, styles.marginVertical_10, styles.Width_90]}>                                    <View                                        style={[styles.position_R, styles.overHidden, styles.height_70, styles.flexCenter]}>                                        <Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden]}>                                            <Input                                                placeholder={i18n.translate('phone')}                                                style={[styles.input, styles.height_50, (this.state.phoneStatus === 1 ? styles.Active : styles.noActive)]}                                                onChangeText={(phone) => this.setState({phone})}                                                onBlur={() => this.unActiveInput('phone')}                                                onFocus={() => this.activeInput('phone')}                                                keyboardType={'number-pad'}                                            />                                        </Item>                                        <View                                            style={[styles.position_A, styles.bg_White, styles.flexCenter, styles.iconInput, (this.state.phoneStatus === 1 ? styles.left_0 : styles.leftHidLeft)]}>                                            <Icon style={[styles.text_orange, styles.textSize_22]}                                                  type="MaterialCommunityIcons" name='cellphone'/>                                        </View>                                    </View>                                    <View                                        style={[styles.position_R, styles.overHidden, styles.height_70, styles.flexCenter]}>                                        <Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden]}>                                            <Input                                                placeholder={i18n.translate('password')}                                                style={[styles.input, styles.height_50, (this.state.passwordStatus === 1 ? styles.Active : styles.noActive)]}                                                onChangeText={(password) => this.setState({password})}                                                onBlur={() => this.unActiveInput('password')}                                                onFocus={() => this.activeInput('password')}                                                secureTextEntry                                            />                                        </Item>                                        <View                                            style={[styles.position_A, styles.bg_White, styles.flexCenter, styles.iconInput, (this.state.passwordStatus === 1 ? styles.left_0 : styles.leftHidLeft)]}>                                            <Icon style={[styles.text_orange, styles.textSize_22]} type="AntDesign" name='lock1'/>                                        </View>                                    </View>                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgetPassword')} style={[styles.marginVertical_5, styles.SelfRight]}>                                        <Text style={[styles.textRegular, styles.textSize_14, styles.marginVertical_5, styles.text_gray]}>                                            {i18n.translate('forgetPassword')}                                        </Text>                                    </TouchableOpacity>                                    {this.renderSubmit()}                                    {                                        this.state.userType === 'user' ?                                            <TouchableOpacity                                                onPress={() => this.props.navigation.navigate('Home', { userType : 'visitor' })}                                                style={[styles.marginVertical_5, styles.flexCenter]}>                                                <Text style={[styles.textRegular, styles.textSize_14, styles.marginVertical_5, styles.text_red]}>                                                    {i18n.translate('vistor')}                                                </Text>                                            </TouchableOpacity>                                            :                                            <View/>                                    }                                </Form>                            </KeyboardAvoidingView>                            <View                                style={[styles.bg_light_gray, styles.SelfLeft, styles.paddingHorizontal_10, styles.height_100, styles.centerContext, styles.marginVertical_25]}>                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Register', { userType : this.state.userType })}                                                  style={[styles.bg_light_oran, styles.paddingHorizontal_10, styles.height_40, styles.centerContext]}>                                    <Text style={[styles.textRegular, styles.textSize_14, styles.text_orange]}>                                        {i18n.translate('doHaveAcc')}                                    </Text>                                </TouchableOpacity>                            </View>                        </View>                </Content>                </ImageBackground>            </Container>        );    }}const mapStateToProps = ({auth, profile, lang}) => {    return {        loading: auth.loading,        auth: auth.user,        msg: auth.msg,        user: profile.user,        lang: lang.lang    };};export default connect(mapStateToProps, {userLogin, profile, chooseLang})(Login);