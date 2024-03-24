// Unused, but kept as documentation
export interface IVRisingServerConfigs {
  "ServerHostSettings.json": {
    Name?: string;
    Description?: string;
    Port?: number;
    QueryPort?: number;
    MaxConnectedUsers?: number;
    MaxConnectedAdmins?: number;
    ServerFps?: number;
    SaveName?: string;
    Password?: string;
    Secure?: boolean;
    ListOnSteam?: boolean;
    ListOnEOS?: boolean;
    AutoSaveCount?: number;
    AutoSaveInterval?: number;
    CompressSaveFiles?: boolean;
    GameSettingsPreset?: string;
    AdminOnlyDebugEvents?: boolean;
    DisableDebugEvents?: boolean;
    API?: {
      Enabled?: boolean;
    };
    Rcon?: {
      Enabled?: boolean;
      Port?: number;
      Password?: string;
    };
  };
  "ServerGameSettings.json": {
    GameModeType?: string;
    CastleDamageMode?: string;
    SiegeWeaponHealth?: string;
    PlayerDamageMode?: string;
    CastleHeartDamageMode?: string;
    PvPProtectionMode?: string;
    DeathContainerPermission?: string;
    RelicSpawnType?: string;
    CanLootEnemyContainers?: boolean;
    BloodBoundEquipment?: boolean;
    TeleportBoundItems?: boolean;
    AllowGlobalChat?: boolean;
    AllWaypointsUnlocked?: boolean;
    FreeCastleClaim?: boolean;
    FreeCastleDestroy?: boolean;
    InactivityKillEnabled?: boolean;
    InactivityKillTimeMin?: number;
    InactivityKillTimeMax?: number;
    InactivityKillSafeTimeAddition?: number;
    InactivityKillTimerMaxItemLevel?: number;
    DisableDisconnectedDeadEnabled?: boolean;
    DisableDisconnectedDeadTimer?: number;
    InventoryStacksModifier?: number;
    DropTableModifier_General?: number;
    DropTableModifier_Missions?: number;
    MaterialYieldModifier_Global?: number;
    BloodEssenceYieldModifier?: number;
    JournalVBloodSourceUnitMaxDistance?: number;
    PvPVampireRespawnModifier?: number;
    CastleMinimumDistanceInFloors?: number;
    ClanSize?: number;
    BloodDrainModifier?: number;
    DurabilityDrainModifier?: number;
    GarlicAreaStrengthModifier?: number;
    HolyAreaStrengthModifier?: number;
    SilverStrengthModifier?: number;
    SunDamageModifier?: number;
    CastleDecayRateModifier?: number;
    CastleBloodEssenceDrainModifier?: number;
    CastleSiegeTimer?: number;
    CastleUnderAttackTimer?: number;
    AnnounceSiegeWeaponSpawn?: boolean;
    ShowSiegeWeaponMapIcon?: boolean;
    BuildCostModifier?: number;
    RecipeCostModifier?: number;
    CraftRateModifier?: number;
    ResearchCostModifier?: number;
    RefinementCostModifier?: number;
    RefinementRateModifier?: number;
    ResearchTimeModifier?: number;
    DismantleResourceModifier?: number;
    ServantConvertRateModifier?: number;
    RepairCostModifier?: number;
    Death_DurabilityFactorLoss?: number;
    Death_DurabilityLossFactorAsResources?: number;
    StarterEquipmentId?: number;
    StarterResourcesId?: number;
    VBloodUnitSettings?: [];
    UnlockedAchievements?: [];
    UnlockedResearchs?: [];
    GameTimeModifiers?: {
      DayDurationInSeconds?: number;
      DayStartHour?: number;
      DayStartMinute?: number;
      DayEndHour?: number;
      DayEndMinute?: number;
      BloodMoonFrequency_Min?: number;
      BloodMoonFrequency_Max?: number;
      BloodMoonBuff?: number;
    };
    VampireStatModifiers?: {
      MaxHealthModifier?: number;
      MaxEnergyModifier?: number;
      PhysicalPowerModifier?: number;
      SpellPowerModifier?: number;
      ResourcePowerModifier?: number;
      SiegePowerModifier?: number;
      DamageReceivedModifier?: number;
      ReviveCancelDelay?: number;
    };
    UnitStatModifiers_Global?: {
      MaxHealthModifier?: number;
      PowerModifier?: number;
    };
    UnitStatModifiers_VBlood?: {
      MaxHealthModifier?: number;
      PowerModifier?: number;
    };
    EquipmentStatModifiers_Global?: {
      MaxEnergyModifier?: number;
      MaxHealthModifier?: number;
      ResourceYieldModifier?: number;
      PhysicalPowerModifier?: number;
      SpellPowerModifier?: number;
      SiegePowerModifier?: number;
      MovementSpeedModifier?: number;
    };
    CastleStatModifiers_Global?: {
      TickPeriod?: number;
      DamageResistance?: number;
      SafetyBoxLimit?: number;
      TombLimit?: number;
      VerminNestLimit?: number;
      PrisonCellLimit?: number;
      PylonPenalties?: {
        Range1?: {
          Percentage?: number;
          Lower?: number;
          Higher?: number;
        };
        Range2?: {
          Percentage?: number;
          Lower?: number;
          Higher?: number;
        };
        Range3?: {
          Percentage?: number;
          Lower?: number;
          Higher?: number;
        };
        Range4?: {
          Percentage?: number;
          Lower?: number;
          Higher?: number;
        };
        Range5?: {
          Percentage?: number;
          Lower?: number;
          Higher?: number;
        };
      };
      FloorPenalties?: {
        Range1?: {
          Percentage?: number;
          Lower?: number;
          Higher?: number;
        };
        Range2?: {
          Percentage?: number;
          Lower?: number;
          Higher?: number;
        };
        Range3?: {
          Percentage?: number;
          Lower?: number;
          Higher?: number;
        };
        Range4?: {
          Percentage?: number;
          Lower?: number;
          Higher?: number;
        };
        Range5?: {
          Percentage?: number;
          Lower?: number;
          Higher?: number;
        };
      };
      HeartLimits?: {
        Level1?: {
          Level?: number;
          FloorLimit?: number;
          ServantLimit?: number;
        };
        Level2?: {
          Level?: number;
          FloorLimit?: number;
          ServantLimit?: number;
        };
        Level3?: {
          Level?: number;
          FloorLimit?: number;
          ServantLimit?: number;
        };
        Level4?: {
          Level?: number;
          FloorLimit?: number;
          ServantLimit?: number;
        };
        Level5?: {
          Level?: number;
          FloorLimit?: number;
          ServantLimit?: number;
        };
      };
      CastleLimit?: number;
    };
    PlayerInteractionSettings?: {
      TimeZone?: string;
      VSPlayerWeekdayTime?: {
        StartHour?: number;
        StartMinute?: number;
        EndHour?: number;
        EndMinute?: number;
      };
      VSPlayerWeekendTime?: {
        StartHour?: number;
        StartMinute?: number;
        EndHour?: number;
        EndMinute?: number;
      };
      VSCastleWeekdayTime?: {
        StartHour?: number;
        StartMinute?: number;
        EndHour?: number;
        EndMinute?: number;
      };
      VSCastleWeekendTime?: {
        StartHour?: number;
        StartMinute?: number;
        EndHour?: number;
        EndMinute?: number;
      };
    };
  };
}
