<?php

namespace App\Http\Controllers;
use Enan\PathaoCourier\Facades\PathaoCourier;
use Illuminate\Http\Request;


class PathaoController extends Controller
{
    public function cities()
    {
        $cities = PathaoCourier::GET_CITIES();
        return response()->json($cities);
    }

    public function zones($city_id)
    {
        $zones = PathaoCourier::GET_ZONES($city_id);
        return response()->json($zones);
    }

    public function areas($zone_id)
    {
        $areas = PathaoCourier::GET_AREAS($zone_id);
        return response()->json($areas);
    }



}
