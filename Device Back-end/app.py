import cv2
from flask import Flask, Response, jsonify
from imutils.video import VideoStream
import numpy as np
import imutils
import time
from datetime import datetime
# import RPi.GPIO as GPIO

app = Flask(__name__)
sub = cv2.createBackgroundSubtractorMOG2()  # create background subtractor
pin = 17
GPIO.setmode(GPIO.BCM)
GPIO.setup(pin, GPIO.OUT)
pwm = GPIO.PWM(pin, 100)
pwm.start(0)

CLASSES = [ "background", "aeroplane", "bicycle", "bird", "boat",
	"bottle", "bus", "car", "cat", "chair", "cow", "diningtable",
	"dog", "horse", "motorbike", "person", "pottedplant", "sheep",
	"sofa", "train", "tvmonitor"]
COLORS = np.random.uniform(0, 255, size=(len(CLASSES), 3))
# load our serialized model from disk
print("[INFO] loading model...")
net = cv2.dnn.readNetFromCaffe(
    'MobileNetSSD_deploy.prototxt.txt', 'MobileNetSSD_deploy.caffemodel')

@app.route('/')
def hello_world():  # put application's code here
    response = {
        "Info" : "Night Time Object Detection API",
        "Devs" : ["Shanwill Pinto", "Simonne Pinto", "Sriganesh", "Vignesh"],
        "OS" : "Ubuntu Server 20.04 LTS",
        "System" : "Raspberry Pi 4 Model B"
    }
    return jsonify(response), 200


def gen():
    count = []
    vs = VideoStream(src=0).start()

    # Video from file using imutils
    # vs = cv2.VideoCapture(filename='Device Back-end\video.mp4')

    # loop over the frames from the video stream
    while True:
        # grab the frame from the threaded video stream and resize it
        # to have a maximum width of 400 pixels
        image = vs.read()
        image = imutils.resize(image, width=500)

        # grab the frame dimensions and convert it to a blob
        (h, w) = image.shape[:2]
        blob = cv2.dnn.blobFromImage(cv2.resize(image, (600, 600)),
                                     0.007843, (300, 300), 127.5)

        # pass the blob through the network and obtain the detections and
        # predictions
        net.setInput(blob)
        detections = net.forward()

        # loop over the detections
        for i in np.arange(0, detections.shape[2]):
            # extract the confidence (i.e., probability) associated with
            # the prediction
            confidence = detections[0, 0, i, 2]

            # filter out weak detections by ensuring the `confidence` is
            # greater than the minimum confidence
            if confidence > 0.2:
                # extract the index of the class label from the
                # `detections`, then compute the (x, y)-coordinates of
                # the bounding box for the object
                idx = int(detections[0, 0, i, 1])
                box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                (startX, startY, endX, endY) = box.astype("int")

                # draw the prediction on the frame
                label = "{}: {:.2f}%".format(CLASSES[idx],
                                             confidence * 100)
                cv2.rectangle(image, (startX, startY), (endX, endY),
                              COLORS[idx], 2)
                y = startY - 15 if startY - 15 > 15 else startY + 15
                cv2.putText(image, label, (startX, y),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, COLORS[idx], 2)
                temp = label.split(" ")
                count.append(temp)
        frame = cv2.imencode('.jpg', image)[1].tobytes()
        print("Objects Detected : ", {
            "count" : len(count),
            "items" : count
        })
        morn = datetime.now()
        eve = datetime.now()
        morn = morn.replace(hour=6, minute=0, second=0, microsecond=0)
        eve = eve.replace(hour=18, minute=0, second=0, microsecond=0)
        time = datetime.now()
        if (time > morn and time < eve):
            print("Lights off")
            GPIO.output(LED_PIN, GPIO.LOW)
        else:
            if(len(count)>=0 and len(count)<=2):
                print("Intensity 20%");
                # GPIO.output(LED_PIN, GPIO.HIGH)
                pwm.ChangeDutyCycle(20)
                
            elif(len(count)>2):
                print("Intensity 100%");
                pwm.ChangeDutyCycle(100);
        count = []
        yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        # time.sleep(0.1)
        key = cv2.waitKey(20)
        if key == 27:
            break

@app.route('/live')
def video_feed():
    """Video streaming route. Put this in the src attribute of an img tag."""
    return Response(gen(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run()
