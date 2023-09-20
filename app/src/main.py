# Copyright (c) 2022 Robert Bosch GmbH and Microsoft Corporation
#
# This program and the accompanying materials are made available under the
# terms of the Apache License, Version 2.0 which is available at
# https://www.apache.org/licenses/LICENSE-2.0.
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations
# under the License.
#
# SPDX-License-Identifier: Apache-2.0

# flake8: noqa: E501,B950 line too long
import asyncio
import json
import logging
import signal

from vehicle import Vehicle, vehicle  # type: ignore
from velocitas_sdk.util.log import (  # type: ignore
    get_opentelemetry_log_factory,
    get_opentelemetry_log_format,
)
from velocitas_sdk.vdb.reply import DataPointReply
from velocitas_sdk.vehicle_app import VehicleApp

# Configure the VehicleApp logger with the necessary log config and level.
logging.setLogRecordFactory(get_opentelemetry_log_factory())
logging.basicConfig(format=get_opentelemetry_log_format())
logging.getLogger().setLevel("DEBUG")
logger = logging.getLogger(__name__)


class MysettingsApp(VehicleApp):
    """Velocitas App for Mysettings."""

    def __init__(self, vehicle_client: Vehicle):
        super().__init__()
        self.Vehicle = vehicle_client
        self.driverPickFlag = None
        self.interval = None
        self.isPersonal = None
        self.outsideTemperature = None
        self.test3 = None
        self.test1 = None
        self.test2 = None

    async def on_start(self):
        await Welcome_plugin.refresh()

        await Welcome_plugin.start()

        self.driverPickFlag = False

        self.interval = 2

        logger.info("hello passenger!")

        await Welcome_plugin.nextStepPY()
        await asyncio.sleep(self.interval)

        await Welcome_plugin.nextStepPY()
        await asyncio.sleep(self.interval)

        await Welcome_plugin.nextStepPY()
        await self.Vehicle.Cabin.Door.Row1.Left.IsOpen.set(True)
        await asyncio.sleep(self.interval)

        await Welcome_plugin.nextStepPY()
        self.isPersonal = await Welcome_plugin.isPersonalPY()
        await asyncio.sleep(self.interval)

        Welcome_plugin.nextStepPY()
        await asyncio.sleep(self.interval)

        await Welcome_plugin.nextStepPY()
        await self.Vehicle.Cabin.Seat.Row1.Pos1.Height.set(100)
        await Welcome_plugin.setSeatPosition()
        await asyncio.sleep(3)

        await Welcome_plugin.nextStepPY()
        await Welcome_plugin.displayCockpitPY()
        await Welcome_plugin.setPersonalizedWelcomeWord()
        await asyncio.sleep(self.interval)

        await Welcome_plugin.nextStepPY()
        await Welcome_plugin.setPreferLanguage()
        await asyncio.sleep(self.interval)

        await Welcome_plugin.nextStepPY()
        await Welcome_plugin.setUSMetricUnits()
        await asyncio.sleep(self.interval)

        await Welcome_plugin.nextStepPY()
        await Welcome_plugin.setInteriorLight()
        await asyncio.sleep(self.interval)

        await Welcome_plugin.nextStepPY()
        await Welcome_plugin.setParkingWarningBeepLevel()
        await asyncio.sleep(self.interval)

        await Welcome_plugin.nextStepPY()
        await Welcome_plugin.turnOnPreferredMusic()
        await asyncio.sleep(self.interval)

        await Welcome_plugin.nextStepPY()
        await Welcome_plugin.setAutoHold()
        await asyncio.sleep(self.interval)

        await Welcome_plugin.nextStepPY()
        await Welcome_plugin.setMirrorStatus()
        await asyncio.sleep(self.interval)

        await Welcome_plugin.nextStepPY()
        await Welcome_plugin.setOnePuddleDrive()
        await asyncio.sleep(self.interval)

        await Welcome_plugin.nextStepPY()
        await Welcome_plugin.setDriveMode()
        await asyncio.sleep(self.interval)

        await Welcome_plugin.nextStepPY()
        self.outsideTemperature = int(await Welcome_plugin.getOutsideTemperature()) 
        logger.info("outside temperature is: %d"%(self.outsideTemperature))
        await asyncio.sleep(self.interval)

        await Welcome_plugin.nextStepPY()
        await asyncio.sleep(self.interval)

        if(self.outsideTemperature < 9):
            logger.info("too cold, open warm AC")
            await Welcome_plugin.nextStepPY()
            await Welcome_plugin.turnOnSetAC("warm AC")
            await asyncio.sleep(self.interval)

            await Welcome_plugin.nextStepPY()
            await Welcome_plugin.turnOnSeatHeat()
            await asyncio.sleep(self.interval)

            await Welcome_plugin.nextStepPY()
            await Welcome_plugin.turnSteeringWheelWarm()
            await asyncio.sleep(self.interval)
        else:
            await Welcome_plugin.nextStepPY()
            await asyncio.sleep(self.interval)
            if(self.outsideTemperature > 25):
                logger.info("too hot, open cool AC")
                await Welcome_plugin.nextStepPY()
                await Welcome_plugin.turnOnSetAC("cool AC")
                await asyncio.sleep(self.interval)

                await Welcome_plugin.nextStepPY()
                await Welcome_plugin.turnOnSeatVentilation()
                await asyncio.sleep(self.interval) 
            else:
                logger.info("normal temperature, no automatic AC")

        await Welcome_plugin.nextStepPY()
        await Welcome_plugin.setACAirFlow()
        await asyncio.sleep(self.interval)

        await Welcome_plugin.nextStepPY()
        await Welcome_plugin.setADASWarningBeepLevel()
        await asyncio.sleep(self.interval)

        self.test3 = (await self.Vehicle.Cabin.HVAC.Station.Row1.Left.Temperature.get()).value
        self.test1 = (await self.Vehicle.Body.Lights.IsHighBeamOn.get()).value
        self.test2 = (await self.Vehicle.Cabin.Seat.Row1.Pos1.Position.get()).value

        await self.Vehicle.Cabin.Door.Row1.Left.IsOpen.set(False)
        await self.Vehicle.Cabin.Seat.Row1.Pos1.Height.set(0)


async def main():
    logger.info("Starting MysettingsApp...")
    vehicle_app = MysettingsApp(vehicle)
    await vehicle_app.run()


LOOP = asyncio.get_event_loop()
LOOP.add_signal_handler(signal.SIGTERM, LOOP.stop)
LOOP.run_until_complete(main())
