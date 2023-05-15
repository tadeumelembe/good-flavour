import React, { useEffect, useState, useRef } from "react";
import { ActivityIndicator, StatusBar, Animated, BackHandler, Pressable, StyleSheet, } from "react-native";
import { Video, ResizeMode, AVPlaybackStatus, AVPlaybackStatusSuccess, VideoReadyForDisplayEvent } from 'expo-av';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import { Button, Container, ImageBackground, ScrollView, Text, View } from "../../../components/Themed";
import { RootStackScreenProps } from "../../../types";
import style from "../../../constants/style";
import Layout from "../../../constants/Layout";

import Header from "../../components/Head";

const headeHeight = Layout.window.height * 35 / 100
const videoContainerHeight = 200

const CookingMode = ({ navigation, route }: RootStackScreenProps<'CookingMode'>) => {

    const { item } = route.params

    const video = useRef(null);
    const [status, setStatus] = useState<AVPlaybackStatusSuccess>({});
    const [isVideoReady, setIsVideoReady] = useState(false);
    const [videoError, setVideoError] = useState('');
    const [controlsWidth, setControlsWidth] = useState(0);
    const [videoDetails, setVideoDetails] = useState<VideoReadyForDisplayEvent>({});
    //const [controlsWidth, setVideoDetails] = useState<VideoReadyForDisplayEvent>({});
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [showControls, setShowControls] = useState(false);

    const [timeoutId, setTimeoutId] = useState('');
    const currenttimeout = useRef();
    currenttimeout.current = timeoutId

    const controllersOpacity = useRef(new Animated.Value(1)).current

    useFocusEffect(() => {
        // This will run when component is `focused` or mounted.
        //StatusBar.setHidden(true);

        // This will run when component is `blured` or unmounted.
        return () => {
            StatusBar.setHidden(false);
        }
    });

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => handleBackButton())
        return () => backHandler.remove()
    }, [])

    function handleBackButton() {
        if (isFullScreen) {
            return true
        }
        return false
    }


    useEffect(() => {
        let timeOut

        let opacity = showControls ? 1 : 0
        Animated.timing(controllersOpacity, {
            toValue: opacity,
            duration: 100,
            useNativeDriver: true
        }).start()

        if (showControls && isPlaying) {
            timeOut = setTimeout(() => {
                setShowControls(false)
                Animated.timing(controllersOpacity, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: true
                }).start()
            }, 2000)
            setTimeoutId(timeOut)
        } else if (!isPlaying) {
            clearTimeout(currenttimeout.current)
        }

    }, [showControls, isPlaying])

    useEffect(() => {
        if (isVideoReady) setShowControls(true)
    }, [isVideoReady])

    useEffect(() => {
        console.log(isFullScreen)
        if (isFullScreen) {
            //console.log(videoContainerHeight * videoDetails.naturalSize.width / videoDetails.naturalSize.height)
            if (videoDetails?.naturalSize?.width > videoDetails?.naturalSize?.height) {

            }
            StatusBar.setHidden(true);
        } else {

            StatusBar.setHidden(false);
        }
    }, [isFullScreen])



    return (
        <Container style={[localStyles.root, { paddingTop: 0 }]}>
            <ScrollView >
                {!isFullScreen &&
                    <View style={style.horizontalPadding}>
                        <Header navigation={navigation} type='back' />

                        <Text style={localStyles.pageTitle}>Cooking Mode</Text>

                        <Text style={localStyles.recipeName}>{item.title}</Text>
                    </View>
                }

                <Animated.View style={isFullScreen ? localStyles.videoContainerFullscreen : localStyles.videoContainer}>

                    {!isVideoReady &&
                        <View style={localStyles.videoLoader}>
                            <ImageBackground
                                source={item.image}
                                resizeMode={'cover'}
                                style={localStyles.image_bg}
                                imageStyle={localStyles.image}
                            >
                                <View style={localStyles.loaderCover}></View>
                                <ActivityIndicator size={'large'} color="#fff" style={localStyles.loader} />
                            </ImageBackground>
                        </View>
                    }

                    {isVideoReady &&
                        <Animated.View style={[localStyles.controlsContainer, { opacity: controllersOpacity, alignSelf: 'center' }]}>

                            <Pressable onPress={() => setShowControls(prevState => !prevState)} style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0)', alignItems: 'center', justifyContent: 'center' }}>
                                {showControls &&
                                    <>
                                        <Pressable onPress={() => setIsPlaying(prevState => !prevState)} style={localStyles.playPauseButton}>
                                            {!isPlaying ?
                                                <Ionicons name="play" size={60} color="white" style={localStyles.playPauseIcon} />
                                                :
                                                <Ionicons name="pause" size={60} color="white" style={localStyles.playPauseIcon} />
                                            }
                                        </Pressable>
                                        <Pressable onPress={() => setIsFullScreen(prevState => !prevState)} style={localStyles.fullScreenButton}>
                                            {!isFullScreen ?
                                                <MaterialIcons name="fullscreen" size={30} color="white" />
                                                :
                                                <MaterialIcons name="fullscreen-exit" size={30} color="white" />
                                            }
                                        </Pressable>
                                    </>
                                }
                            </Pressable>

                        </Animated.View>
                    }

                    <Video
                        ref={video}
                        style={localStyles.video}
                        source={{
                            uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',//'https://scontent-jnb1-1.cdninstagram.com/o1/v/t16/f1/m78/EC4464B2D10B74DC74DBC9B379B93683_video_dashinit.mp4?efg=eyJxZV9ncm91cHMiOiJbXCJpZ193ZWJfZGVsaXZlcnlfdnRzX290ZlwiXSIsInZlbmNvZGVfdGFnIjoidnRzX3ZvZF91cmxnZW4uNDgwLnN0b3J5LmJhc2VsaW5lIn0&_nc_ht=scontent-jnb1-1.cdninstagram.com&_nc_cat=102&vs=1322204014971969_672847916&_nc_vs=HBkcFQIYUWlnX3hwdl9wbGFjZW1lbnRfcGVybWFuZW50X3YyL0VDNDQ2NEIyRDEwQjc0REM3NERCQzlCMzc5QjkzNjgzX3ZpZGVvX2Rhc2hpbml0Lm1wNBUAAsgBACgAGAAbAYgHdXNlX29pbAExFQAAJrD58dGN5Ms%2FFQIoAkMzLBdAF3bItDlYEBgSZGFzaF9iYXNlbGluZV8yX3YxEQB16AcA&ccb=9-4&oh=00_AfCRW0sF6gfEUG829QUAoGw6iwC98-a4ip9JQM5egzwtEw&oe=646208FB&_nc_sid=276363',
                        }}
                        //useNativeControls
                        resizeMode={ResizeMode.CONTAIN}
                        onLoad={(e) => console.log(e)}
                        onError={(e) => setVideoError(e)}
                        isLooping
                        posterSource={item.image}
                        usePoster={false}
                        shouldPlay={isPlaying}
                        //onPlaybackStatusUpdate={status => { setStatus(() => status) }}
                        onReadyForDisplay={(e) => {
                            setControlsWidth(() => videoContainerHeight * e.naturalSize.width / e.naturalSize.height)

                            setVideoDetails(e)
                            setIsVideoReady(true)
                        }}
                    />

                </Animated.View>


            </ScrollView>
        </Container>

    )
}

export default CookingMode

const localStyles = StyleSheet.create({
    root: {
        paddingHorizontal: 0,
        flex: 1
    },
    scrollView: {
        //height: '100%'
        paddingTop: -30
    },
    pageTitle: {
        ...style.textH1,
        paddingTop: 15,
        paddingBottom: 30
    },
    recipeName: {
        ...style.textH2
    },
    videoContainer: {
        height: videoContainerHeight,
        width: '100%',
        marginTop: 20,
    },
    videoContainerFullscreen: {
        height: Layout.window.height,
        width: Layout.window.width,
        transform:[{
            rotate:'0deg'
        }]
    },
    image: {
        height: '100%'
    },
    image_bg: {
        height: '100%',
        justifyContent: 'flex-start',
    },
    videoLoaderSkeleton: {
        backgroundColor: 'rgba(40, 41, 40, .9)',

    },
    video: {
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(40, 41, 40, 0.8)',
    },
    controlsContainer: {
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(40, 41, 40, 0.5)',
        position: 'absolute',
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    controlsContainerHidden: {
        backgroundColor: 'rgba(40, 41, 40, 0)',
    },
    playPauseButton: {
        width: 80,
        height: 80,
        borderRadius: 45,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        zIndex: 1,
        justifyContent: 'center',
    },
    fullScreenButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 1
    },
    playPauseIcon: {
        paddingLeft: 6
    },
    videoLoader: {
        position: 'absolute',
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
    },
    loaderCover: {
        height: '100%',
        backgroundColor: 'rgba(40, 41, 40, 1)',

    },
    loader: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    }
})